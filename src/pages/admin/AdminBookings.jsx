import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  deleteReservation,
  fetchAdminOverview,
  fetchAdminReservations,
  updateReservationStatus,
} from '../../utils/api';
import AdminStatCard from './AdminStatCard';
import AdminAddBooking from './AdminAddBooking';

const sourceLabels = {
  online: 'Online',
  phone: 'Phone',
  email: 'Email',
  'walk-in': 'Walk-in',
  admin: 'Staff',
};

const statusStyles = {
  confirmed: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  cancelled: 'bg-gray-100 text-gray-600 ring-1 ring-gray-200',
  completed: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
  'no-show': 'bg-red-50 text-red-700 ring-1 ring-red-200',
};

function AdminBookings() {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filterDate) params.date = filterDate;
      if (filterStatus) params.status = filterStatus;

      const [bookings, stats] = await Promise.all([
        fetchAdminReservations(params),
        fetchAdminOverview(),
      ]);
      setReservations(bookings);
      setOverview(stats);
      setError('');
    } catch (err) {
      if (err.message === 'UNAUTHORIZED') {
        navigate('/admin/login', { replace: true });
        return;
      }
      setError('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filterDate, filterStatus]);

  const handleStatusChange = async (id, status) => {
    try {
      await updateReservationStatus(id, status);
      loadData();
    } catch {
      setError('Failed to update reservation');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this reservation permanently?')) return;
    try {
      await deleteReservation(id);
      loadData();
    } catch {
      setError('Failed to delete reservation');
    }
  };

  if (loading && !overview) {
    return <p className="text-gray-500 font-admin">Loading bookings…</p>;
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <AdminStatCard
          label="Total bookings"
          value={overview?.totalReservations ?? 0}
          accent="charcoal"
        />
        <AdminStatCard
          label="Today"
          value={overview?.todayCount ?? 0}
          accent="red"
        />
        <AdminStatCard
          label="Upcoming confirmed"
          value={overview?.upcomingCount ?? 0}
          accent="gold"
        />
      </div>

      <AdminAddBooking onCreated={loadData} />

      <div className="admin-card overflow-hidden">
        <div className="admin-panel-header">
          <h2 className="admin-heading">
            All Bookings
            <span className="ml-2 text-gray-400 font-normal tabular-nums">({reservations.length})</span>
          </h2>
          <div className="flex flex-wrap gap-3">
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="admin-input"
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="admin-input"
            >
              <option value="">All statuses</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="no-show">No show</option>
            </select>
            <button onClick={loadData} className="admin-btn-primary">
              Refresh
            </button>
          </div>
        </div>

        {error && (
          <div className="mx-6 mt-4 px-4 py-3 bg-red-50 text-red-700 text-sm rounded-lg font-admin">{error}</div>
        )}

        {reservations.length === 0 ? (
          <p className="p-10 text-center text-gray-500 font-admin">No bookings found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="admin-table min-w-full">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Guest</th>
                  <th>Source</th>
                  <th>Party</th>
                  <th>Table</th>
                  <th>Contact</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {reservations.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="whitespace-nowrap tabular-nums">{booking.date}</td>
                    <td className="whitespace-nowrap tabular-nums">{booking.time}</td>
                    <td>
                      <p className="font-medium text-yun-charcoal">{booking.name}</p>
                      {booking.notes && (
                        <p className="text-xs text-gray-500 mt-0.5 truncate max-w-[200px]">{booking.notes}</p>
                      )}
                    </td>
                    <td>
                      <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                        {sourceLabels[booking.source] || 'Online'}
                      </span>
                    </td>
                    <td className="tabular-nums font-medium">{booking.guests}</td>
                    <td className="whitespace-nowrap">{booking.tableName}</td>
                    <td>
                      <p>{booking.email}</p>
                      <p className="text-gray-500 tabular-nums">{booking.phone}</p>
                    </td>
                    <td>
                      <span className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full ${statusStyles[booking.status] || statusStyles.confirmed}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td>
                      <div className="flex flex-col gap-1.5">
                        <select
                          value={booking.status}
                          onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                          className="admin-input text-xs py-1.5"
                        >
                          <option value="confirmed">Confirmed</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                          <option value="no-show">No show</option>
                        </select>
                        <button
                          onClick={() => handleDelete(booking.id)}
                          className="text-xs text-red-600 hover:text-red-700 text-left font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminBookings;
