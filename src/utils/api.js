const API_BASE = '/api';

export async function fetchConfig() {
  const res = await fetch(`${API_BASE}/config`);
  if (!res.ok) throw new Error('Failed to load config');
  return res.json();
}

export async function fetchAvailability(date, guests) {
  const params = new URLSearchParams({ date });
  if (guests) params.set('guests', guests);
  const res = await fetch(`${API_BASE}/availability?${params}`);
  if (!res.ok) throw new Error('Failed to check availability');
  return res.json();
}

export async function createOrder(data) {
  const res = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(
      body.error || 'Could not place order. Make sure the server is running (npm run dev).',
    );
  }

  return body;
}

export async function createReservation(data) {
  const res = await fetch(`${API_BASE}/reservations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body.error || 'Failed to create reservation');
  return body;
}

export function getAdminToken() {
  return sessionStorage.getItem('yunhai_admin_token');
}

export function setAdminToken(token) {
  sessionStorage.setItem('yunhai_admin_token', token);
}

export function clearAdminToken() {
  sessionStorage.removeItem('yunhai_admin_token');
}

async function adminFetch(path, options = {}) {
  const token = getAdminToken();
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const body = await res.json().catch(() => ({}));
  if (res.status === 401) {
    clearAdminToken();
    throw new Error('UNAUTHORIZED');
  }
  if (!res.ok) throw new Error(body.error || 'Request failed');
  return body;
}

export async function verifyAdminSession() {
  const token = getAdminToken();
  if (!token) return false;

  try {
    const res = await fetch(`${API_BASE}/admin/overview`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 401) {
      clearAdminToken();
      return false;
    }
    return res.ok;
  } catch {
    return false;
  }
}

export async function adminLogin(password) {
  const res = await fetch(`${API_BASE}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: password.trim() }),
  });

  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(body.error || 'Login failed');
  }

  if (!body.token) {
    throw new Error('Could not reach the reservation server. Make sure npm run dev is running.');
  }

  return body;
}

export function adminLogout() {
  return adminFetch('/admin/logout', { method: 'POST' }).catch(() => {});
}

export function fetchAdminReservations(params = {}) {
  const query = new URLSearchParams(params).toString();
  return adminFetch(`/admin/reservations${query ? `?${query}` : ''}`);
}

export function fetchAdminAvailability(date, guests) {
  const params = new URLSearchParams({ date });
  if (guests) params.set('guests', guests);
  return adminFetch(`/admin/availability?${params}`);
}

export function createAdminReservation(data) {
  return adminFetch('/admin/reservations', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateReservationStatus(id, status) {
  return adminFetch(`/admin/reservations/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export function deleteReservation(id) {
  return adminFetch(`/admin/reservations/${id}`, { method: 'DELETE' });
}

export function fetchSchedule(date) {
  return adminFetch(`/admin/schedule?date=${date}`);
}

export function fetchAdminConfig() {
  return adminFetch('/admin/config');
}

export function saveAdminConfig(config) {
  return adminFetch('/admin/config', {
    method: 'PUT',
    body: JSON.stringify(config),
  });
}

export function fetchAdminOverview() {
  return adminFetch('/admin/overview');
}

export function fetchAdminOrders(params = {}) {
  const query = new URLSearchParams(params).toString();
  return adminFetch(`/admin/orders${query ? `?${query}` : ''}`);
}

export function updateOrderStatus(id, status) {
  return adminFetch(`/admin/orders/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}
