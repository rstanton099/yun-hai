import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchSchedule } from '../../utils/api';

function AdminSchedule() {
  const navigate = useNavigate();
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadSchedule = async () => {
    try {
      setLoading(true);
      const data = await fetchSchedule(date);
      setSchedule(data);
      setError('');
    } catch (err) {
      if (err.message === 'UNAUTHORIZED') {
        navigate('/admin/login', { replace: true });
        return;
      }
      setError('Failed to load schedule');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSchedule();
  }, [date]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="admin-subheading">Daily Schedule</h2>
          <p className="text-sm text-gray-500 mt-1 font-admin">
            See which tables are booked at each time slot
          </p>
        </div>
        <div className="flex gap-3">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="admin-input"
          />
          <button onClick={loadSchedule} className="admin-btn-primary">
            Refresh
          </button>
        </div>
      </div>

      {schedule?.summary && (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
          {schedule.summary.map((slot) => (
            <div
              key={slot.time}
              className={`admin-card p-4 text-center ${
                slot.isFull ? 'bg-red-50/50' : 'bg-emerald-50/50'
              }`}
            >
              <p className="font-admin font-semibold tabular-nums text-yun-charcoal">{slot.time}</p>
              <p className={`text-xs mt-1.5 font-admin tabular-nums font-medium ${
                slot.isFull ? 'text-red-700' : 'text-emerald-700'
              }`}>
                {slot.bookedTables}/{slot.totalTables} booked
              </p>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 text-red-700 text-sm rounded-lg font-admin">{error}</div>
      )}

      {loading ? (
        <p className="text-gray-500 font-admin">Loading schedule…</p>
      ) : schedule ? (
        <div className="admin-card overflow-x-auto">
          <table className="admin-table min-w-full">
            <thead>
              <tr>
                <th className="sticky left-0 bg-gray-50/95 z-10 min-w-[140px]">Table</th>
                {schedule.timeSlots.map((time) => (
                  <th key={time} className="text-center min-w-[100px] whitespace-nowrap tabular-nums">
                    {time}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {schedule.grid.map((row) => (
                <tr key={row.table.id} className="border-t border-gray-100">
                  <td className="sticky left-0 bg-white z-10 border-r border-gray-100">
                    <p className="font-medium text-yun-charcoal">{row.table.name}</p>
                    <p className="text-xs text-gray-500 tabular-nums">
                      Seats {row.table.capacity}
                    </p>
                  </td>
                  {row.slots.map((slot) => (
                    <td
                      key={`${row.table.id}-${slot.time}`}
                      className={`text-center align-top ${
                        slot.booking ? 'bg-yun-red/5' : 'bg-gray-50/50'
                      }`}
                    >
                      {slot.booking ? (
                        <div className="text-xs py-1">
                          <p className="font-medium text-yun-charcoal truncate" title={slot.booking.name}>
                            {slot.booking.name}
                          </p>
                          <p className="text-gray-500 tabular-nums">{slot.booking.guests} guests</p>
                        </div>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      <div className="mt-4 flex gap-4 text-xs text-gray-500 font-admin">
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 bg-yun-red/10 border border-yun-red/20 rounded inline-block" />
          Booked
        </span>
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 bg-gray-50 border border-gray-200 rounded inline-block" />
          Available
        </span>
      </div>
    </div>
  );
}

export default AdminSchedule;
