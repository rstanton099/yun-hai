import { useEffect, useState } from 'react';
import PageBanner from '../components/PageBanner';
import DecorativeBorder from '../components/DecorativeBorder';
import HoursWidget from '../components/HoursWidget';
import { restaurantInfo } from '../data/menu';
import { createReservation, fetchAvailability, fetchConfig } from '../utils/api';

function getTodayString() {
  return new Date().toISOString().slice(0, 10);
}

function isTimeInPast(date, time) {
  if (date !== getTodayString()) return false;
  const [hours, minutes] = time.split(':').map(Number);
  const slotTime = new Date();
  slotTime.setHours(hours, minutes, 0, 0);
  return slotTime <= new Date();
}

function Reservations() {
  const [submitted, setSubmitted] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [error, setError] = useState('');
  const [availability, setAvailability] = useState([]);
  const [maxGuests, setMaxGuests] = useState(8);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: '2',
    notes: '',
  });

  useEffect(() => {
    fetchConfig()
      .then((config) => setMaxGuests(config.maxOnlineGuests))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!form.date) {
      setAvailability([]);
      return;
    }

    const loadAvailability = async () => {
      setLoadingSlots(true);
      setError('');
      try {
        const data = await fetchAvailability(form.date, form.guests);
        setAvailability(data.slots);
        if (
          form.time
          && !data.slots.find(
            (s) => s.time === form.time && s.available && !isTimeInPast(form.date, s.time),
          )
        ) {
          setForm((prev) => ({ ...prev, time: '' }));
        }
      } catch {
        setError('Unable to check availability. Please try again.');
      } finally {
        setLoadingSlots(false);
      }
    };

    loadAvailability();
  }, [form.date, form.guests]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const booking = await createReservation(form);
      setConfirmedBooking(booking);
      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const guestOptions = Array.from({ length: maxGuests }, (_, i) => i + 1);
  const today = getTodayString();
  const bookableSlots = availability.filter((slot) => !isTimeInPast(form.date, slot.time));

  return (
    <>
      <PageBanner
        title="Reservations"
        chinese="订位"
        subtitle="Book your table online. Availability updates in real time."
      />

      <section className="py-12 md:py-16 bg-yun-cream">
        <div className="page-container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              {submitted && confirmedBooking ? (
                <div className="bg-white p-8 md:p-12 shadow-md text-center">
                  <div className="text-5xl mb-4">✓</div>
                  <h2 className="section-heading mb-4">Booking Confirmed</h2>
                  <DecorativeBorder className="max-w-xs mx-auto" />
                  <p className="text-yun-ink/80 mb-4">
                    Thank you, <strong>{confirmedBooking.name}</strong>. Your table is reserved.
                  </p>
                  <div className="inline-block text-left bg-yun-cream px-6 py-4 text-sm space-y-1 mb-6">
                    <p><span className="text-yun-gold font-medium">Date:</span> {confirmedBooking.date}</p>
                    <p><span className="text-yun-gold font-medium">Time:</span> {confirmedBooking.time}</p>
                    <p><span className="text-yun-gold font-medium">Guests:</span> {confirmedBooking.guests}</p>
                    <p><span className="text-yun-gold font-medium">Table:</span> {confirmedBooking.tableName}</p>
                  </div>
                  <p className="text-sm text-yun-ink/60">
                    A confirmation will be sent to <strong>{confirmedBooking.email}</strong>.
                    Need to change your booking? Call us on {restaurantInfo.phone}.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-white p-6 md:p-10 shadow-md">
                  <h2 className="font-display text-2xl font-semibold text-yun-charcoal mb-6">Book a Table</h2>

                  {error && (
                    <div className="mb-6 px-4 py-3 bg-red-50 text-yun-red text-sm">{error}</div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-yun-ink mb-1">Full Name *</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={form.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-yun-gold/30 focus:border-yun-red focus:ring-1 focus:ring-yun-red outline-none"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-yun-ink mb-1">Email *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={form.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-yun-gold/30 focus:border-yun-red focus:ring-1 focus:ring-yun-red outline-none"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-yun-ink mb-1">Phone *</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        required
                        value={form.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-yun-gold/30 focus:border-yun-red focus:ring-1 focus:ring-yun-red outline-none"
                      />
                    </div>
                    <div>
                      <label htmlFor="guests" className="block text-sm font-medium text-yun-ink mb-1">Guests *</label>
                      <select
                        id="guests"
                        name="guests"
                        required
                        value={form.guests}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-yun-gold/30 focus:border-yun-red focus:ring-1 focus:ring-yun-red outline-none bg-white"
                      >
                        {guestOptions.map((n) => (
                          <option key={n} value={n}>{n} {n === 1 ? 'guest' : 'guests'}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="date" className="block text-sm font-medium text-yun-ink mb-1">Date *</label>
                      <input
                        type="date"
                        id="date"
                        name="date"
                        required
                        min={today}
                        value={form.date}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-yun-gold/30 focus:border-yun-red focus:ring-1 focus:ring-yun-red outline-none"
                      />
                    </div>
                    <div>
                      <label htmlFor="time" className="block text-sm font-medium text-yun-ink mb-1">Time *</label>
                      <select
                        id="time"
                        name="time"
                        required
                        value={form.time}
                        onChange={handleChange}
                        disabled={!form.date || loadingSlots}
                        className="w-full px-4 py-3 border border-yun-gold/30 focus:border-yun-red focus:ring-1 focus:ring-yun-red outline-none bg-white disabled:bg-gray-50 disabled:text-gray-400"
                      >
                        <option value="">
                          {!form.date
                            ? 'Select a date first'
                            : loadingSlots
                              ? 'Checking availability…'
                              : 'Select a time'}
                        </option>
                        {bookableSlots.map((slot) => (
                          <option key={slot.time} value={slot.time} disabled={!slot.available}>
                            {slot.time}{!slot.available ? ' — Fully booked' : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mt-6">
                    <label htmlFor="notes" className="block text-sm font-medium text-yun-ink mb-1">Special Requests</label>
                    <textarea
                      id="notes"
                      name="notes"
                      rows={3}
                      value={form.notes}
                      onChange={handleChange}
                      placeholder="Dietary requirements, celebrations, seating preferences..."
                      className="w-full px-4 py-3 border border-yun-gold/30 focus:border-yun-red focus:ring-1 focus:ring-yun-red outline-none resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !form.time}
                    className="btn-primary mt-8 w-full sm:w-auto disabled:opacity-50"
                  >
                    {loading ? 'Booking…' : 'Confirm Reservation'}
                  </button>
                </form>
              )}
            </div>

            <div className="space-y-6">
              <HoursWidget />
              <div className="bg-white p-6 shadow-md text-sm text-yun-ink/70 space-y-3">
                <h3 className="font-display text-lg text-yun-charcoal">Good to Know</h3>
                <p>Tables are held for 15 minutes past your reservation time.</p>
                <p>Parties of {maxGuests + 1} or more — please call {restaurantInfo.phone} to arrange a set menu.</p>
                <p>Unavailable time slots are fully booked for your party size.</p>
                <p>High chairs and children&apos;s portions available on request.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Reservations;
