import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BOARD_COLUMNS,
  ORDER_STATUSES,
  getNextStatus,
  getNextStatusLabel,
  isActiveOrder,
} from '../../data/orderStatuses';
import { fetchAdminOrders, fetchAdminOverview, updateOrderStatus } from '../../utils/api';
import AdminStatCard from './AdminStatCard';

function OrderCard({ order, onMove, moving }) {
  const nextStatus = getNextStatus(order);
  const nextLabel = getNextStatusLabel(order);
  const time = new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 space-y-3">
      <div className="flex justify-between items-start gap-2">
        <div>
          <p className="font-semibold text-yun-charcoal tabular-nums">#{order.id}</p>
          <p className="text-xs text-gray-500">{time}</p>
        </div>
        <span className={`text-xs font-medium px-2 py-1 rounded-full uppercase tracking-wide ${
          order.type === 'delivery'
            ? 'bg-violet-100 text-violet-700'
            : 'bg-yun-gold/20 text-yun-gold-dark'
        }`}>
          {order.type}
        </span>
      </div>

      <div>
        <p className="font-medium text-sm text-yun-charcoal">{order.customer.name}</p>
        <p className="text-xs text-gray-500 tabular-nums">{order.customer.phone}</p>
        {order.type === 'delivery' && order.customer.address && (
          <p className="text-xs text-gray-500 mt-1 leading-snug">{order.customer.address}</p>
        )}
        {order.customer.email && (
          <p className="text-xs text-gray-400 mt-0.5">{order.customer.email}</p>
        )}
      </div>

      <ul className="text-xs text-gray-600 space-y-0.5 border-t border-gray-100 pt-2">
        {order.items.map((item) => (
          <li key={`${order.id}-${item.id}`} className="flex justify-between gap-2">
            <span>{item.quantity}× {item.name}</span>
            <span className="tabular-nums shrink-0">£{(item.price * item.quantity).toFixed(2)}</span>
          </li>
        ))}
      </ul>

      <div className="flex justify-between items-center text-sm border-t border-gray-100 pt-2">
        <span className="font-semibold text-yun-charcoal tabular-nums">£{order.total.toFixed(2)}</span>
        {order.deliveryFee > 0 && (
          <span className="text-xs text-gray-500">incl. £{order.deliveryFee.toFixed(2)} delivery</span>
        )}
      </div>

      {order.notes && (
        <p className="text-xs text-gray-500 bg-gray-50 rounded px-2 py-1.5">
          <span className="font-medium">Note:</span> {order.notes}
        </p>
      )}

      <div className="flex flex-col gap-2 pt-1">
        {nextStatus && order.status !== 'completed' && order.status !== 'cancelled' && (
          <button
            type="button"
            disabled={moving}
            onClick={() => onMove(order.id, nextStatus)}
            className="admin-btn-primary w-full text-xs py-2 disabled:opacity-50"
          >
            {moving ? 'Updating…' : nextLabel}
          </button>
        )}
        {order.status !== 'cancelled' && (
          <select
            value={order.status}
            disabled={moving}
            onChange={(e) => onMove(order.id, e.target.value)}
            className="admin-input text-xs py-1.5"
          >
            {Object.entries(ORDER_STATUSES).map(([key, { label }]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
}

function AdminOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [movingId, setMovingId] = useState(null);
  const [showCompleted, setShowCompleted] = useState(true);
  const [showCancelled, setShowCancelled] = useState(false);

  const loadOrders = useCallback(async () => {
    try {
      const [data, stats] = await Promise.all([
        fetchAdminOrders(),
        fetchAdminOverview(),
      ]);
      setOrders(data);
      setOverview(stats);
      setError('');
    } catch (err) {
      if (err.message === 'UNAUTHORIZED') {
        navigate('/admin/login', { replace: true });
        return;
      }
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 15000);
    return () => clearInterval(interval);
  }, [loadOrders]);

  const handleMove = async (id, status) => {
    try {
      setMovingId(id);
      await updateOrderStatus(id, status);
      await loadOrders();
    } catch {
      setError('Failed to update order');
    } finally {
      setMovingId(null);
    }
  };

  const visibleColumns = BOARD_COLUMNS.filter((col) => {
    if (col === 'completed') return showCompleted;
    return true;
  });

  const cancelledOrders = orders.filter((o) => o.status === 'cancelled');
  const activeCount = orders.filter((o) => isActiveOrder(o.status)).length;

  if (loading && !overview) {
    return <p className="text-gray-500">Loading orders…</p>;
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <AdminStatCard label="Active orders" value={overview?.activeOrders ?? activeCount} accent="red" />
        <AdminStatCard label="Waiting" value={orders.filter((o) => o.status === 'waiting').length} accent="gold" />
        <AdminStatCard label="Completed today" value={orders.filter((o) => {
          if (o.status !== 'completed') return false;
          const today = new Date().toISOString().slice(0, 10);
          return o.updated_at?.slice(0, 10) === today || o.created_at.slice(0, 10) === today;
        }).length} accent="charcoal" />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="admin-subheading">Takeaway / Delivery</h2>
          <p className="text-sm text-gray-500 mt-1">
            Drag orders through the kitchen workflow. Auto-refreshes every 15 seconds.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={showCompleted}
              onChange={(e) => setShowCompleted(e.target.checked)}
              className="rounded"
            />
            Show completed
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={showCancelled}
              onChange={(e) => setShowCancelled(e.target.checked)}
              className="rounded"
            />
            Show cancelled
          </label>
          <button onClick={loadOrders} className="admin-btn-primary">Refresh</button>
        </div>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 text-red-700 text-sm rounded-lg">{error}</div>
      )}

      {orders.length === 0 ? (
        <div className="admin-card p-12 text-center text-gray-500">
          No takeaway or delivery orders yet. Orders placed online will appear here.
        </div>
      ) : (
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-max">
            {visibleColumns.map((status) => {
              const column = ORDER_STATUSES[status];
              const columnOrders = orders.filter((o) => o.status === status);

              return (
                <div
                  key={status}
                  className={`w-72 shrink-0 rounded-xl border-2 ${column.color} p-3 flex flex-col max-h-[calc(100vh-18rem)]`}
                >
                  <div className="flex justify-between items-center mb-3 px-1">
                    <h3 className="font-semibold text-sm text-yun-charcoal">{column.label}</h3>
                    <span className="text-xs font-medium tabular-nums bg-white/80 px-2 py-0.5 rounded-full text-gray-600">
                      {columnOrders.length}
                    </span>
                  </div>
                  <div className="space-y-3 overflow-y-auto flex-1 pr-1">
                    {columnOrders.length === 0 ? (
                      <p className="text-xs text-gray-400 text-center py-6 px-2">No orders</p>
                    ) : (
                      columnOrders.map((order) => (
                        <OrderCard
                          key={order.id}
                          order={order}
                          onMove={handleMove}
                          moving={movingId === order.id}
                        />
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {showCancelled && cancelledOrders.length > 0 && (
        <div className="mt-8">
          <h3 className="admin-heading mb-4">Cancelled orders</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cancelledOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onMove={handleMove}
                moving={movingId === order.id}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminOrders;
