import { useState } from 'react';
import PageBanner from '../components/PageBanner';
import DecorativeBorder from '../components/DecorativeBorder';
import HoursWidget from '../components/HoursWidget';
import { restaurantInfo } from '../data/menu';

function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(form.subject || 'Enquiry from Yun Hai website');
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`,
    );
    window.location.href = `mailto:${restaurantInfo.email}?subject=${subject}&body=${body}`;
  };

  return (
    <>
      <PageBanner
        title="Contact"
        chinese="联系"
        subtitle="We'd love to hear from you. Reach out for reservations, events, or general enquiries."
      />

      <section className="py-12 md:py-16 bg-yun-cream">
        <div className="page-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="section-heading mb-4">Find Us</h2>
              <DecorativeBorder className="max-w-xs" />

              <div className="space-y-6 mt-8">
                <div>
                  <h3 className="font-display text-lg text-yun-charcoal mb-2">Address</h3>
                  <address className="not-italic text-yun-ink/80">
                    <p>{restaurantInfo.address}</p>
                    <p>{restaurantInfo.city}</p>
                  </address>
                </div>

                <div>
                  <h3 className="font-display text-lg text-yun-charcoal mb-2">Phone</h3>
                  <a
                    href={`tel:${restaurantInfo.phone.replace(/\s/g, '')}`}
                    className="text-yun-red hover:underline text-lg"
                  >
                    {restaurantInfo.phone}
                  </a>
                </div>

                <div>
                  <h3 className="font-display text-lg text-yun-charcoal mb-2">Email</h3>
                  <a href={`mailto:${restaurantInfo.email}`} className="text-yun-red hover:underline">
                    {restaurantInfo.email}
                  </a>
                </div>

                <div>
                  <h3 className="font-display text-lg text-yun-charcoal mb-2">Getting Here</h3>
                  <p className="text-yun-ink/80 text-sm leading-relaxed">
                    Nearest tube: Old Street (Northern line), 5 min walk.
                    Bus routes 55, 243 stop on Commercial Street.
                    Limited street parking; NCP car park on Paul Street.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 shadow-md">
                <h3 className="font-display text-xl font-semibold text-yun-charcoal mb-2">Send a Message</h3>
                <p className="text-sm text-yun-ink/60 mb-6">
                  Fill in the form below and your email app will open ready to send to{' '}
                  <strong>{restaurantInfo.email}</strong>.
                </p>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-yun-ink mb-1">Your Name *</label>
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
                    <label htmlFor="email" className="block text-sm font-medium text-yun-ink mb-1">Your Email *</label>
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
                    <label htmlFor="subject" className="block text-sm font-medium text-yun-ink mb-1">Subject *</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      required
                      value={form.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-yun-gold/30 focus:border-yun-red focus:ring-1 focus:ring-yun-red outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-yun-ink mb-1">Message *</label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      required
                      value={form.message}
                      onChange={handleChange}
                      placeholder="How can we help?"
                      className="w-full px-4 py-3 border border-yun-gold/30 focus:border-yun-red focus:ring-1 focus:ring-yun-red outline-none resize-none"
                    />
                  </div>
                </div>

                <button type="submit" className="btn-primary mt-6 w-full sm:w-auto">
                  Send Email
                </button>
              </form>

              <HoursWidget />

              <div className="bg-yun-charcoal/5 border border-yun-gold/30 aspect-video flex items-center justify-center">
                <div className="text-center p-6">
                  <p className="font-serif text-yun-gold text-2xl mb-2">地图</p>
                  <p className="text-yun-ink/60 text-sm">Map placeholder</p>
                  <p className="text-yun-ink/40 text-xs mt-2">{restaurantInfo.address}, {restaurantInfo.city}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Contact;
