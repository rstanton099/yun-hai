export const ORDER_STATUSES = {
  waiting: { label: 'Waiting', color: 'border-amber-300 bg-amber-50' },
  cooking: { label: 'Cooking', color: 'border-blue-300 bg-blue-50' },
  ready_pickup: { label: 'Awaiting Pickup', color: 'border-emerald-300 bg-emerald-50' },
  ready_delivery: { label: 'Awaiting Delivery', color: 'border-violet-300 bg-violet-50' },
  completed: { label: 'Completed', color: 'border-gray-300 bg-gray-50' },
  cancelled: { label: 'Cancelled', color: 'border-red-300 bg-red-50' },
};

export const BOARD_COLUMNS = [
  'waiting',
  'cooking',
  'ready_pickup',
  'ready_delivery',
  'completed',
];

export function getNextStatus(order) {
  const flow = {
    waiting: 'cooking',
    cooking: order.type === 'delivery' ? 'ready_delivery' : 'ready_pickup',
    ready_pickup: 'completed',
    ready_delivery: 'completed',
  };
  return flow[order.status] || null;
}

export function getNextStatusLabel(order) {
  const labels = {
    cooking: 'Start cooking',
    ready_pickup: 'Ready for pickup',
    ready_delivery: 'Ready for delivery',
    completed: 'Mark complete',
  };
  const next = getNextStatus(order);
  return labels[next] || null;
}

export function normalizeStatus(status, type) {
  const legacy = {
    pending: 'waiting',
    preparing: 'cooking',
    ready: type === 'delivery' ? 'ready_delivery' : 'ready_pickup',
  };
  return legacy[status] || status;
}

export function isActiveOrder(status) {
  return !['completed', 'cancelled'].includes(status);
}
