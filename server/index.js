import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { defaultConfig } from './defaultConfig.js';
import {
  buildTablesFromConfig,
  findAvailableTable,
  getSlotAvailability,
  getMaxPartyForSlot,
} from './tables.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3002;
const DATA_DIR = path.join(__dirname, '..');
const RESERVATIONS_FILE = path.join(DATA_DIR, 'reservations.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const CONFIG_FILE = path.join(DATA_DIR, 'config.json');
const DELIVERY_FEE = 3.5;
const FREE_DELIVERY_MINIMUM = 30;
const CLIENT_DIST = path.join(DATA_DIR, 'dist');
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'yunhai-admin';
const SESSION_TTL_MS = 12 * 60 * 60 * 1000;

const sessions = new Map();

app.use(cors());
app.use(bodyParser.json());

function readJson(file, fallback) {
  try {
    if (!fs.existsSync(file)) return fallback;
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return fallback;
  }
}

function writeJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function readReservations() {
  return readJson(RESERVATIONS_FILE, []);
}

function writeReservations(reservations) {
  writeJson(RESERVATIONS_FILE, reservations);
}

function normalizeOrderStatus(status, type) {
  const legacy = {
    pending: 'waiting',
    preparing: 'cooking',
    ready: type === 'delivery' ? 'ready_delivery' : 'ready_pickup',
  };
  return legacy[status] || status;
}

function readOrders() {
  const orders = readJson(ORDERS_FILE, []);
  return orders.map((order) => ({
    ...order,
    status: normalizeOrderStatus(order.status, order.type),
  }));
}

function writeOrders(orders) {
  writeJson(ORDERS_FILE, orders);
}

function readConfig() {
  const config = readJson(CONFIG_FILE, null);
  if (!config) {
    writeJson(CONFIG_FILE, defaultConfig);
    return { ...defaultConfig };
  }
  return {
    ...defaultConfig,
    ...config,
    tableGroups: config.tableGroups || defaultConfig.tableGroups,
    timeSlots: config.timeSlots || defaultConfig.timeSlots,
  };
}

function writeConfig(config) {
  writeJson(CONFIG_FILE, config);
}

function getTables() {
  return buildTablesFromConfig(readConfig());
}

function createToken() {
  return crypto.randomBytes(32).toString('hex');
}

function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token || !sessions.has(token)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const session = sessions.get(token);
  if (Date.now() > session.expiresAt) {
    sessions.delete(token);
    return res.status(401).json({ error: 'Session expired' });
  }

  req.adminSession = session;
  return next();
}

function getMaxTableCapacity() {
  const tables = getTables();
  return tables.length ? Math.max(...tables.map((t) => t.capacity)) : 8;
}

function parseGuests(guests, maxAllowed = 8) {
  const count = Number(guests);
  if (!Number.isFinite(count) || count < 1 || count > maxAllowed) return null;
  return count;
}

function buildReservation({ name, email, phone, date, time, guests, notes, source = 'online' }) {
  const config = readConfig();

  if (!name || !phone || !date || !time || !guests) {
    return { error: 'Name, phone, date, time, and party size are required', status: 400 };
  }

  if (!config.timeSlots.includes(time)) {
    return { error: 'Invalid time slot', status: 400 };
  }

  const tables = getTables();
  const reservations = readReservations();
  const table = findAvailableTable(tables, reservations, date, time, guests);

  if (!table) {
    return {
      error: 'No tables available for this date, time, and party size. Please choose another slot.',
      status: 409,
    };
  }

  const reservation = {
    id: Date.now(),
    name: String(name).trim(),
    email: email ? String(email).trim() : '',
    phone: String(phone).trim(),
    date,
    time,
    guests,
    notes: notes ? String(notes).trim() : '',
    tableId: table.id,
    tableName: table.name,
    status: 'confirmed',
    source,
    created_at: new Date().toISOString(),
  };

  reservations.push(reservation);
  writeReservations(reservations);

  return { reservation, status: 201 };
}

if (!fs.existsSync(RESERVATIONS_FILE)) {
  writeReservations([]);
}

if (!fs.existsSync(ORDERS_FILE)) {
  writeOrders([]);
}

// Public config (no secrets)
app.get('/api/config', (req, res) => {
  const config = readConfig();
  res.json({
    timeSlots: config.timeSlots,
    maxOnlineGuests: config.maxOnlineGuests,
    tableCount: getTables().length,
  });
});

app.get('/api/availability', (req, res) => {
  try {
    const { date, guests } = req.query;
    if (!date) {
      return res.status(400).json({ error: 'Date is required' });
    }

    const config = readConfig();
    const guestCount = guests ? parseGuests(guests, config.maxOnlineGuests) : null;
    const tables = getTables();
    const reservations = readReservations();

    const slots = config.timeSlots.map((time) => {
      const availability = getSlotAvailability(tables, reservations, date, time);
      const maxParty = getMaxPartyForSlot(tables, reservations, date, time);
      const canBook = guestCount
        ? Boolean(findAvailableTable(tables, reservations, date, time, guestCount))
        : maxParty > 0;

      return {
        time,
        available: canBook,
        bookedTables: availability.bookedTables,
        totalTables: availability.totalTables,
        availableTables: availability.availableTables,
        maxParty,
        isFull: availability.isFull,
      };
    });

    res.json({ date, guests: guestCount, slots });
  } catch {
    res.status(500).json({ error: 'Failed to check availability' });
  }
});

app.post('/api/reservations', (req, res) => {
  try {
    const { name, email, phone, date, time, guests, notes } = req.body;
    const config = readConfig();
    const guestCount = parseGuests(guests, config.maxOnlineGuests);

    if (!email) {
      return res.status(400).json({ error: 'All required fields must be completed' });
    }

    if (!guestCount) {
      return res.status(400).json({
        error: `Online bookings are limited to ${config.maxOnlineGuests} guests. Please call the restaurant for larger parties.`,
      });
    }

    const result = buildReservation({
      name, email, phone, date, time, guests: guestCount, notes, source: 'online',
    });

    if (result.error) {
      return res.status(result.status).json({ error: result.error });
    }

    return res.status(201).json(result.reservation);
  } catch {
    res.status(500).json({ error: 'Failed to create reservation' });
  }
});

app.post('/api/orders', (req, res) => {
  try {
    const { type, name, phone, email, address, notes, items } = req.body;

    if (!['takeaway', 'delivery'].includes(type)) {
      return res.status(400).json({ error: 'Invalid order type' });
    }

    if (!name || !phone || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Name, phone, and at least one item are required' });
    }

    if (type === 'delivery' && !address?.trim()) {
      return res.status(400).json({ error: 'Delivery address is required' });
    }

    const sanitizedItems = items.map((item) => ({
      id: String(item.id),
      name: String(item.name),
      price: Number(item.price),
      quantity: Math.max(1, Number(item.quantity) || 1),
    }));

    const subtotal = sanitizedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const deliveryFee = type === 'delivery' && subtotal < FREE_DELIVERY_MINIMUM
      ? DELIVERY_FEE
      : 0;

    const order = {
      id: Date.now(),
      type,
      customer: {
        name: String(name).trim(),
        phone: String(phone).trim(),
        email: email ? String(email).trim() : '',
        address: address ? String(address).trim() : '',
      },
      items: sanitizedItems,
      subtotal: Math.round(subtotal * 100) / 100,
      deliveryFee,
      total: Math.round((subtotal + deliveryFee) * 100) / 100,
      notes: notes ? String(notes).trim() : '',
      status: 'waiting',
      created_at: new Date().toISOString(),
    };

    const orders = readOrders();
    orders.push(order);
    writeOrders(orders);

    res.status(201).json(order);
  } catch {
    res.status(500).json({ error: 'Failed to place order' });
  }
});

// Admin auth
app.post('/api/admin/login', (req, res) => {
  const password = String(req.body?.password || '').trim();
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Invalid password' });
  }

  const token = createToken();
  sessions.set(token, { expiresAt: Date.now() + SESSION_TTL_MS });

  res.json({ token, expiresIn: SESSION_TTL_MS });
});

app.post('/api/admin/logout', requireAuth, (req, res) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (token) sessions.delete(token);
  res.json({ ok: true });
});

// Admin reservations
app.get('/api/admin/availability', requireAuth, (req, res) => {
  try {
    const { date, guests } = req.query;
    if (!date) {
      return res.status(400).json({ error: 'Date is required' });
    }

    const guestCount = guests ? parseGuests(guests, getMaxTableCapacity()) : null;
    const config = readConfig();
    const tables = getTables();
    const reservations = readReservations();

    const slots = config.timeSlots.map((time) => {
      const availability = getSlotAvailability(tables, reservations, date, time);
      const maxParty = getMaxPartyForSlot(tables, reservations, date, time);
      const canBook = guestCount
        ? Boolean(findAvailableTable(tables, reservations, date, time, guestCount))
        : maxParty > 0;

      return {
        time,
        available: canBook,
        bookedTables: availability.bookedTables,
        totalTables: availability.totalTables,
        availableTables: availability.availableTables,
        maxParty,
        isFull: availability.isFull,
      };
    });

    res.json({ date, guests: guestCount, slots, maxTableCapacity: getMaxTableCapacity() });
  } catch {
    res.status(500).json({ error: 'Failed to check availability' });
  }
});

app.post('/api/admin/reservations', requireAuth, (req, res) => {
  try {
    const { name, email, phone, date, time, guests, notes, source } = req.body;
    const guestCount = parseGuests(guests, getMaxTableCapacity());
    const validSources = ['phone', 'email', 'walk-in', 'admin'];

    if (!guestCount) {
      return res.status(400).json({
        error: `Party size must be between 1 and ${getMaxTableCapacity()} guests.`,
      });
    }

    const result = buildReservation({
      name,
      email,
      phone,
      date,
      time,
      guests: guestCount,
      notes,
      source: validSources.includes(source) ? source : 'admin',
    });

    if (result.error) {
      return res.status(result.status).json({ error: result.error });
    }

    return res.status(201).json(result.reservation);
  } catch {
    res.status(500).json({ error: 'Failed to create reservation' });
  }
});

app.get('/api/admin/reservations', requireAuth, (req, res) => {
  const { date, status } = req.query;
  let reservations = readReservations();

  if (date) {
    reservations = reservations.filter((r) => r.date === date);
  }
  if (status) {
    reservations = reservations.filter((r) => r.status === status);
  }

  reservations.sort((a, b) => {
    const dateCompare = b.date.localeCompare(a.date);
    if (dateCompare !== 0) return dateCompare;
    return b.time.localeCompare(a.time);
  });

  res.json(reservations);
});

app.patch('/api/admin/reservations/:id', requireAuth, (req, res) => {
  const id = Number(req.params.id);
  const { status } = req.body;
  const validStatuses = ['confirmed', 'cancelled', 'completed', 'no-show'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  const reservations = readReservations();
  const index = reservations.findIndex((r) => r.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Reservation not found' });
  }

  reservations[index] = {
    ...reservations[index],
    status,
    updated_at: new Date().toISOString(),
  };

  writeReservations(reservations);
  res.json(reservations[index]);
});

app.delete('/api/admin/reservations/:id', requireAuth, (req, res) => {
  const id = Number(req.params.id);
  const reservations = readReservations();
  const index = reservations.findIndex((r) => r.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Reservation not found' });
  }

  reservations.splice(index, 1);
  writeReservations(reservations);
  res.json({ ok: true });
});

// Admin schedule grid
app.get('/api/admin/schedule', requireAuth, (req, res) => {
  const { date } = req.query;
  if (!date) {
    return res.status(400).json({ error: 'Date is required' });
  }

  const config = readConfig();
  const tables = getTables();
  const reservations = readReservations().filter(
    (r) => r.date === date && r.status !== 'cancelled',
  );

  const grid = tables.map((table) => ({
    table,
    slots: config.timeSlots.map((time) => {
      const booking = reservations.find(
        (r) => r.tableId === table.id && r.time === time,
      );
      return {
        time,
        booking: booking
          ? {
              id: booking.id,
              name: booking.name,
              guests: booking.guests,
              phone: booking.phone,
              status: booking.status,
            }
          : null,
      };
    }),
  }));

  const summary = config.timeSlots.map((time) => {
    const availability = getSlotAvailability(tables, readReservations(), date, time);
    return {
      time,
      bookedTables: availability.bookedTables,
      totalTables: availability.totalTables,
      isFull: availability.isFull,
    };
  });

  res.json({ date, timeSlots: config.timeSlots, tables, grid, summary });
});

// Admin config
app.get('/api/admin/config', requireAuth, (req, res) => {
  res.json(readConfig());
});

app.put('/api/admin/config', requireAuth, (req, res) => {
  const { tableGroups, timeSlots, maxOnlineGuests } = req.body;
  const current = readConfig();

  if (!Array.isArray(tableGroups) || !Array.isArray(timeSlots)) {
    return res.status(400).json({ error: 'Invalid configuration format' });
  }

  const sanitizedGroups = tableGroups.map((group) => ({
    label: String(group.label || '').trim() || 'Table',
    capacity: Math.max(1, Number(group.capacity) || 2),
    count: Math.max(0, Number(group.count) || 0),
    type: group.type === 'room' ? 'room' : 'table',
  })).filter((group) => group.count > 0);

  const sanitizedSlots = [...new Set(
    timeSlots
      .map((slot) => String(slot).trim())
      .filter(Boolean),
  )].sort();

  if (sanitizedGroups.length === 0 || sanitizedSlots.length === 0) {
    return res.status(400).json({ error: 'At least one table group and one time slot is required' });
  }

  const updated = {
    ...current,
    tableGroups: sanitizedGroups,
    timeSlots: sanitizedSlots,
    maxOnlineGuests: Math.max(1, Number(maxOnlineGuests) || current.maxOnlineGuests),
  };

  writeConfig(updated);
  res.json(updated);
});

app.get('/api/admin/orders', requireAuth, (req, res) => {
  const { status, type } = req.query;
  let orders = readOrders();

  if (status) orders = orders.filter((o) => o.status === status);
  if (type) orders = orders.filter((o) => o.type === type);

  orders.sort((a, b) => b.created_at.localeCompare(a.created_at));
  res.json(orders);
});

app.patch('/api/admin/orders/:id', requireAuth, (req, res) => {
  const id = Number(req.params.id);
  const { status } = req.body;
  const validStatuses = [
    'waiting', 'cooking', 'ready_pickup', 'ready_delivery', 'completed', 'cancelled',
  ];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  const orders = readOrders();
  const index = orders.findIndex((o) => o.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Order not found' });
  }

  orders[index] = {
    ...orders[index],
    status,
    updated_at: new Date().toISOString(),
  };

  writeOrders(orders);
  res.json(orders[index]);
});

app.get('/api/admin/overview', requireAuth, (req, res) => {
  const reservations = readReservations();
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = reservations.filter(
    (r) => r.date >= today && r.status === 'confirmed',
  );

  const orders = readOrders();

  res.json({
    totalReservations: reservations.length,
    upcomingCount: upcoming.length,
    todayCount: reservations.filter((r) => r.date === today && r.status === 'confirmed').length,
    activeOrders: orders.filter(
      (o) => !['completed', 'cancelled'].includes(o.status),
    ).length,
    pendingOrders: orders.filter((o) => o.status === 'waiting').length,
    tables: getTables(),
    config: readConfig(),
  });
});

if (fs.existsSync(CLIENT_DIST)) {
  app.use(express.static(CLIENT_DIST));
  app.get('*', (req, res) => {
    if (path.extname(req.path)) {
      return res.status(404).end();
    }
    return res.sendFile(path.join(CLIENT_DIST, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Yun Hai server running on port ${PORT}`);
});
