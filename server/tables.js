export function buildTablesFromConfig(config) {
  const tables = [];

  config.tableGroups.forEach((group) => {
    for (let i = 1; i <= group.count; i += 1) {
      const prefix = group.type === 'room' ? 'ROOM' : `T${group.capacity}`;
      tables.push({
        id: `${prefix}-${i}`,
        name: group.count === 1 && group.type === 'room'
          ? group.label
          : `${group.label} ${i}`,
        capacity: group.capacity,
        type: group.type,
        groupLabel: group.label,
      });
    }
  });

  return tables;
}

export function findAvailableTable(tables, reservations, date, time, guests) {
  const guestCount = Number(guests);
  const bookedTableIds = new Set(
    reservations
      .filter((r) => r.date === date && r.time === time && r.status !== 'cancelled')
      .map((r) => r.tableId),
  );

  const candidates = tables
    .filter((table) => !bookedTableIds.has(table.id) && table.capacity >= guestCount)
    .sort((a, b) => a.capacity - b.capacity);

  return candidates[0] || null;
}

export function getSlotAvailability(tables, reservations, date, time) {
  const active = reservations.filter(
    (r) => r.date === date && r.time === time && r.status !== 'cancelled',
  );
  const bookedIds = new Set(active.map((r) => r.tableId));
  const availableTables = tables.filter((t) => !bookedIds.has(t.id));

  return {
    date,
    time,
    totalTables: tables.length,
    bookedTables: active.length,
    availableTables: availableTables.length,
    isFull: availableTables.length === 0,
    bookings: active,
  };
}

export function getMaxPartyForSlot(tables, reservations, date, time) {
  const availability = getSlotAvailability(tables, reservations, date, time);
  if (availability.isFull) return 0;

  const bookedIds = new Set(availability.bookings.map((r) => r.tableId));
  const freeTables = tables.filter((t) => !bookedIds.has(t.id));
  return Math.max(...freeTables.map((t) => t.capacity), 0);
}
