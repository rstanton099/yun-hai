export const defaultConfig = {
  tableGroups: [
    { label: 'Table for 2', capacity: 2, count: 4, type: 'table' },
    { label: 'Table for 4', capacity: 4, count: 6, type: 'table' },
    { label: 'Private Room', capacity: 8, count: 1, type: 'room' },
  ],
  timeSlots: [
    '12:00', '12:30', '13:00', '13:30',
    '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00',
  ],
  maxOnlineGuests: 8,
};
