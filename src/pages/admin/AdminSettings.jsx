import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAdminConfig, saveAdminConfig } from '../../utils/api';
import AdminStatCard from './AdminStatCard';

const emptyGroup = () => ({ label: '', capacity: 2, count: 1, type: 'table' });

function AdminSettings() {
  const navigate = useNavigate();
  const [config, setConfig] = useState(null);
  const [timeSlotsText, setTimeSlotsText] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadConfig = async () => {
    try {
      setLoading(true);
      const data = await fetchAdminConfig();
      setConfig(data);
      setTimeSlotsText(data.timeSlots.join(', '));
      setError('');
    } catch (err) {
      if (err.message === 'UNAUTHORIZED') {
        navigate('/admin/login', { replace: true });
        return;
      }
      setError('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConfig();
  }, []);

  const updateGroup = (index, field, value) => {
    setConfig((prev) => {
      const groups = [...prev.tableGroups];
      groups[index] = { ...groups[index], [field]: value };
      return { ...prev, tableGroups: groups };
    });
  };

  const addGroup = () => {
    setConfig((prev) => ({
      ...prev,
      tableGroups: [...prev.tableGroups, emptyGroup()],
    }));
  };

  const removeGroup = (index) => {
    setConfig((prev) => ({
      ...prev,
      tableGroups: prev.tableGroups.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const timeSlots = timeSlotsText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const saved = await saveAdminConfig({
        tableGroups: config.tableGroups,
        timeSlots,
        maxOnlineGuests: config.maxOnlineGuests,
      });

      setConfig(saved);
      setTimeSlotsText(saved.timeSlots.join(', '));
      setMessage('Settings saved. New bookings will use this configuration.');
    } catch (err) {
      setError(err.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const totalTables = config?.tableGroups.reduce((sum, g) => sum + Number(g.count || 0), 0) ?? 0;
  const totalCovers = config?.tableGroups.reduce(
    (sum, g) => sum + Number(g.count || 0) * Number(g.capacity || 0),
    0,
  ) ?? 0;

  if (loading) {
    return <p className="text-gray-500 font-admin">Loading settings…</p>;
  }

  return (
    <div className="max-w-3xl">
      <h2 className="admin-subheading mb-2">Configuration</h2>
      <p className="text-sm text-gray-500 mb-6 font-admin">
        Manage table layout and booking time slots. Changes affect future availability immediately.
      </p>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <AdminStatCard label="Tables" value={totalTables} accent="charcoal" />
        <AdminStatCard label="Total covers" value={totalCovers} accent="gold" />
      </div>

      {message && (
        <div className="mb-4 px-4 py-3 bg-emerald-50 text-emerald-800 text-sm rounded-lg font-admin">{message}</div>
      )}
      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 text-red-700 text-sm rounded-lg font-admin">{error}</div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <section className="admin-card p-6">
          <h3 className="admin-heading mb-4">Table Layout</h3>

          <div className="space-y-3">
            {config.tableGroups.map((group, index) => (
              <div key={index} className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-end p-4 bg-gray-50 rounded-lg">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-500 mb-1 font-admin">Label</label>
                  <input
                    type="text"
                    value={group.label}
                    onChange={(e) => updateGroup(index, 'label', e.target.value)}
                    className="admin-input w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1 font-admin">Seats</label>
                  <input
                    type="number"
                    min="1"
                    value={group.capacity}
                    onChange={(e) => updateGroup(index, 'capacity', Number(e.target.value))}
                    className="admin-input w-full tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1 font-admin">Count</label>
                  <input
                    type="number"
                    min="0"
                    value={group.count}
                    onChange={(e) => updateGroup(index, 'count', Number(e.target.value))}
                    className="admin-input w-full tabular-nums"
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={group.type}
                    onChange={(e) => updateGroup(index, 'type', e.target.value)}
                    className="admin-input flex-1"
                  >
                    <option value="table">Table</option>
                    <option value="room">Room</option>
                  </select>
                  {config.tableGroups.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeGroup(index)}
                      className="admin-btn text-red-600 hover:bg-red-50"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addGroup}
            className="mt-4 text-sm text-yun-red hover:underline font-admin font-medium"
          >
            + Add table group
          </button>
        </section>

        <section className="admin-card p-6 space-y-4">
          <h3 className="admin-heading">Booking Rules</h3>

          <div>
            <label className="block text-sm font-medium text-yun-ink mb-1 font-admin">
              Time slots (comma-separated)
            </label>
            <textarea
              value={timeSlotsText}
              onChange={(e) => setTimeSlotsText(e.target.value)}
              rows={2}
              className="admin-input w-full"
              placeholder="12:00, 12:30, 18:00, 18:30"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-yun-ink mb-1 font-admin">
              Max guests per online booking
            </label>
            <input
              type="number"
              min="1"
              value={config.maxOnlineGuests}
              onChange={(e) => setConfig((prev) => ({
                ...prev,
                maxOnlineGuests: Number(e.target.value),
              }))}
              className="admin-input w-32 tabular-nums"
            />
            <p className="text-xs text-gray-500 mt-1 font-admin">
              Parties larger than this must call the restaurant.
            </p>
          </div>
        </section>

        <button
          type="submit"
          disabled={saving}
          className="admin-btn-primary disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save Configuration'}
        </button>
      </form>
    </div>
  );
}

export default AdminSettings;
