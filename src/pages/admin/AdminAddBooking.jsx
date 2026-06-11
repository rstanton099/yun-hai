import { useEffect, useState } from 'react';
import { createAdminReservation, fetchAdminAvailability } from '../../utils/api';

const emptyForm = {
  name: '',
  email: '',
  phone: '',
  date: '',
  time: '',
  guests: '2',
  notes: '',
  source: 'phone',
};

function AdminAddBooking({ onCreated }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [availability, setAvailability] = useState([]);
  const [maxGuests, setMaxGuests] = useState(8);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!open || !form.date) {
      setAvailability([]);
      return;
    }

    const loadAvailability = async () => {
      setLoadingSlots(true);
      try {
        const data = await fetchAdminAvailability(form.date, form.guests);
        setAvailability(data.slots);
        setMaxGuests(data.maxTableCapacity || 8);
        if (form.time && !data.slots.find((s) => s.time === form.time && s.available)) {
          setForm((prev) => ({ ...prev, time: '' }));
        }
      } catch {
        setError('Unable to check availability.');
      } finally {
        setLoadingSlots(false);
      }
    };

    loadAvailability();
  }, [open, form.date, form.guests]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const booking = await createAdminReservation(form);
      setSuccess(`Booked ${booking.name} — ${booking.tableName} on ${booking.date} at ${booking.time}`);
      setForm(emptyForm);
      onCreated?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const guestOptions = Array.from({ length: maxGuests }, (_, i) => i + 1);

  return (
    <div className="admin-card mb-8 overflow-hidden">
      <button
        type="button"
        onClick={() => {
          setOpen(!open);
          setError('');
          setSuccess('');
        }}
        className="w-full admin-panel-header text-left hover:bg-gray-50/80 transition-colors"
      >
        <div>
          <h2 className="admin-heading">Add Booking</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Manually book a table for phone, email, or walk-in requests
          </p>
        </div>
        <span className="admin-btn-primary shrink-0">
          {open ? 'Close' : '+ New booking'}
        </span>
      </button>

      {open && (
        <form onSubmit={handleSubmit} className="p-6 border-t border-gray-100">
          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 text-red-700 text-sm rounded-lg">{error}</div>
          )}
          {success && (
            <div className="mb-4 px-4 py-3 bg-emerald-50 text-emerald-800 text-sm rounded-lg">{success}</div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label htmlFor="admin-name" className="block text-xs font-medium text-gray-500 mb-1">Guest name *</label>
              <input
                id="admin-name"
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                className="admin-input w-full"
              />
            </div>
            <div>
              <label htmlFor="admin-phone" className="block text-xs font-medium text-gray-500 mb-1">Phone *</label>
              <input
                id="admin-phone"
                name="phone"
                type="tel"
                required
                value={form.phone}
                onChange={handleChange}
                className="admin-input w-full"
              />
            </div>
            <div>
              <label htmlFor="admin-email" className="block text-xs font-medium text-gray-500 mb-1">Email</label>
              <input
                id="admin-email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Optional"
                className="admin-input w-full"
              />
            </div>
            <div>
              <label htmlFor="admin-source" className="block text-xs font-medium text-gray-500 mb-1">Source *</label>
              <select
                id="admin-source"
                name="source"
                value={form.source}
                onChange={handleChange}
                className="admin-input w-full"
              >
                <option value="phone">Phone call</option>
                <option value="email">Email</option>
                <option value="walk-in">Walk-in</option>
                <option value="admin">Other</option>
              </select>
            </div>
            <div>
              <label htmlFor="admin-guests" className="block text-xs font-medium text-gray-500 mb-1">Guests *</label>
              <select
                id="admin-guests"
                name="guests"
                required
                value={form.guests}
                onChange={handleChange}
                className="admin-input w-full"
              >
                {guestOptions.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="admin-date" className="block text-xs font-medium text-gray-500 mb-1">Date *</label>
              <input
                id="admin-date"
                name="date"
                type="date"
                required
                min={new Date().toISOString().slice(0, 10)}
                value={form.date}
                onChange={handleChange}
                className="admin-input w-full"
              />
            </div>
            <div>
              <label htmlFor="admin-time" className="block text-xs font-medium text-gray-500 mb-1">Time *</label>
              <select
                id="admin-time"
                name="time"
                required
                value={form.time}
                onChange={handleChange}
                disabled={!form.date || loadingSlots}
                className="admin-input w-full disabled:bg-gray-50"
              >
                <option value="">
                  {!form.date ? 'Select date first' : loadingSlots ? 'Checking…' : 'Select time'}
                </option>
                {availability.map((slot) => (
                  <option key={slot.time} value={slot.time} disabled={!slot.available}>
                    {slot.time}{!slot.available ? ' — Full' : ''}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2 lg:col-span-3">
              <label htmlFor="admin-notes" className="block text-xs font-medium text-gray-500 mb-1">Notes</label>
              <textarea
                id="admin-notes"
                name="notes"
                rows={2}
                value={form.notes}
                onChange={handleChange}
                placeholder="Dietary needs, special occasions, etc."
                className="admin-input w-full resize-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting || !form.time}
            className="admin-btn-primary mt-6 disabled:opacity-50"
          >
            {submitting ? 'Booking…' : 'Confirm booking'}
          </button>
        </form>
      )}
    </div>
  );
}

export default AdminAddBooking;
