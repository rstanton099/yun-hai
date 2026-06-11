import { useMemo, useState } from 'react';
import { getOrderableItems, menuCategories, orderConfig, restaurantInfo } from '../data/menu';
import { createOrder } from '../utils/api';
import DecorativeBorder from './DecorativeBorder';

function OrderForm({ type }) {
  const isDelivery = type === 'delivery';
  const config = orderConfig[type];
  const orderableItems = useMemo(() => getOrderableItems(), []);

  if (!config) {
    return (
      <div className="bg-white p-8 shadow-md text-center max-w-2xl mx-auto">
        <p className="text-yun-red">This ordering page is not available. Please use takeaway or delivery.</p>
      </div>
    );
  }

  const [cart, setCart] = useState({});
  const [activeCategory, setActiveCategory] = useState(menuCategories[0].id);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [confirmed, setConfirmed] = useState(null);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    notes: '',
  });

  const cartLines = orderableItems
    .filter((item) => cart[item.id])
    .map((item) => ({
      ...item,
      quantity: cart[item.id],
      lineTotal: item.price * cart[item.id],
    }));

  const subtotal = cartLines.reduce((sum, line) => sum + line.lineTotal, 0);
  const deliveryFee = isDelivery && subtotal > 0 && subtotal < orderConfig.delivery.freeDeliveryMinimum
    ? orderConfig.delivery.fee
    : 0;
  const total = subtotal + deliveryFee;

  const addItem = (id) => {
    setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const updateQty = (id, delta) => {
    setCart((prev) => {
      const next = { ...prev };
      const qty = (next[id] || 0) + delta;
      if (qty <= 0) delete next[id];
      else next[id] = qty;
      return next;
    });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cartLines.length === 0) {
      setError('Please add at least one item to your order.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const order = await createOrder({
        type,
        ...form,
        items: cartLines.map(({ id, name, price, quantity }) => ({
          id, name, price, quantity,
        })),
      });
      setConfirmed(order);
      setCart({});
      setForm({ name: '', phone: '', email: '', address: '', notes: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (confirmed) {
    return (
      <div className="bg-white p-8 md:p-12 shadow-md text-center max-w-2xl mx-auto">
        <div className="text-5xl mb-4">✓</div>
        <h2 className="section-heading mb-4">Order Placed</h2>
        <DecorativeBorder className="max-w-xs mx-auto" />
        <p className="text-yun-ink/80 mb-4">
          Thank you, <strong>{confirmed.customer.name}</strong>. Your order <strong>#{confirmed.id}</strong> has been received.
        </p>
        <div className="inline-block text-left bg-yun-cream px-6 py-4 text-sm space-y-1 mb-6">
          <p><span className="text-yun-gold font-medium">Type:</span> {isDelivery ? 'Delivery' : 'Takeaway'}</p>
          <p><span className="text-yun-gold font-medium">Total:</span> £{confirmed.total.toFixed(2)}</p>
          <p><span className="text-yun-gold font-medium">Ready in:</span> {config.readyTime}</p>
        </div>
        <p className="text-sm text-yun-ink/60">
          We&apos;ll call if we need anything. Questions? {restaurantInfo.phone}
        </p>
      </div>
    );
  }

  const activeItems = menuCategories.find((c) => c.id === activeCategory)?.items || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white p-6 shadow-md">
          <h3 className="font-display text-xl font-semibold text-yun-charcoal mb-4">Choose dishes</h3>
          <div className="flex flex-wrap gap-2 mb-6">
            {menuCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 text-sm font-medium transition-all ${
                  activeCategory === cat.id
                    ? 'bg-yun-red text-white'
                    : 'bg-yun-cream text-yun-ink hover:bg-yun-gold/20'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
          <div className="space-y-3">
            {activeItems.map((item, index) => {
              const id = `${activeCategory}-${index}`;
              const qty = cart[id] || 0;
              return (
                <div key={id} className="flex justify-between items-start gap-4 py-3 border-b border-yun-gold/20 last:border-0">
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <h4 className="font-display font-semibold text-yun-charcoal">{item.name}</h4>
                      <span className="font-serif text-yun-gold text-sm">{item.chinese}</span>
                    </div>
                    <p className="text-sm text-yun-ink/60 mt-0.5">{item.description}</p>
                    <p className="text-yun-red font-semibold mt-1">£{item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {qty > 0 && (
                      <>
                        <button type="button" onClick={() => updateQty(id, -1)} className="w-8 h-8 border border-yun-gold/40 text-yun-charcoal hover:bg-yun-cream">−</button>
                        <span className="w-6 text-center tabular-nums font-medium">{qty}</span>
                      </>
                    )}
                    <button type="button" onClick={() => addItem(id)} className="w-8 h-8 bg-yun-red text-white hover:bg-yun-red-dark">+</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md">
          <h3 className="font-display text-xl font-semibold text-yun-charcoal mb-4">Your details</h3>
          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 text-yun-red text-sm">{error}</div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-yun-ink mb-1">Name *</label>
              <input id="name" name="name" required value={form.name} onChange={handleChange} className="w-full px-4 py-3 border border-yun-gold/30 focus:border-yun-red outline-none" />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="phone" className="block text-sm font-medium text-yun-ink mb-1">Phone number *</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                value={form.phone}
                onChange={handleChange}
                placeholder="So we can reach you about your order"
                className="w-full px-4 py-3 border border-yun-gold/30 focus:border-yun-red outline-none"
              />
            </div>
            <div className={isDelivery ? '' : 'sm:col-span-2'}>
              <label htmlFor="email" className="block text-sm font-medium text-yun-ink mb-1">Email</label>
              <input id="email" name="email" type="email" value={form.email} onChange={handleChange} className="w-full px-4 py-3 border border-yun-gold/30 focus:border-yun-red outline-none" />
            </div>
            {isDelivery && (
              <div className="sm:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-yun-ink mb-1">Delivery address *</label>
                <input id="address" name="address" required value={form.address} onChange={handleChange} placeholder="Street, postcode" className="w-full px-4 py-3 border border-yun-gold/30 focus:border-yun-red outline-none" />
              </div>
            )}
            <div className="sm:col-span-2">
              <label htmlFor="notes" className="block text-sm font-medium text-yun-ink mb-1">Notes</label>
              <textarea id="notes" name="notes" rows={2} value={form.notes} onChange={handleChange} placeholder="Allergies, extra napkins, etc." className="w-full px-4 py-3 border border-yun-gold/30 focus:border-yun-red outline-none resize-none" />
            </div>
          </div>
          <button type="submit" disabled={submitting || cartLines.length === 0} className="btn-primary mt-6 disabled:opacity-50">
            {submitting ? 'Placing order…' : `Place ${isDelivery ? 'delivery' : 'takeaway'} order`}
          </button>
        </form>
      </div>

      <div className="space-y-6">
        <div className="bg-yun-charcoal text-white p-6">
          <h3 className="font-display text-lg text-yun-gold mb-3">
            {isDelivery ? 'Delivery info' : 'Collection info'}
          </h3>
          <ul className="text-sm text-white/80 space-y-2">
            {isDelivery ? (
              <>
                <li>Local delivery within {orderConfig.delivery.radius}</li>
                <li>£{orderConfig.delivery.fee.toFixed(2)} delivery fee</li>
                <li>Free delivery on orders over £{orderConfig.delivery.freeDeliveryMinimum}</li>
                <li>Ready in {orderConfig.delivery.readyTime}</li>
                <li>{orderConfig.delivery.payment}</li>
              </>
            ) : (
              <>
                <li>Collect from {restaurantInfo.address}</li>
                <li>Ready in {orderConfig.takeaway.readyTime}</li>
                <li>{orderConfig.takeaway.payment}</li>
              </>
            )}
            <li>
              Questions?{' '}
              <a href={`tel:${restaurantInfo.phone.replace(/\s/g, '')}`} className="text-yun-gold hover:text-yun-gold-light">
                {restaurantInfo.phone}
              </a>
            </li>
          </ul>
        </div>

        <div className="bg-white p-6 shadow-md sticky top-24">
          <h3 className="font-display text-lg font-semibold text-yun-charcoal mb-4">Your order</h3>
          {cartLines.length === 0 ? (
            <p className="text-sm text-yun-ink/60">Add items from the menu to get started.</p>
          ) : (
            <div className="space-y-3">
              {cartLines.map((line) => (
                <div key={line.id} className="flex justify-between text-sm gap-2">
                  <span className="text-yun-ink">
                    {line.quantity}× {line.name}
                  </span>
                  <span className="tabular-nums font-medium shrink-0">£{line.lineTotal.toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t border-yun-gold/20 pt-3 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-yun-ink/70">Subtotal</span>
                  <span className="tabular-nums">£{subtotal.toFixed(2)}</span>
                </div>
                {isDelivery && (
                  <div className="flex justify-between">
                    <span className="text-yun-ink/70">Delivery</span>
                    <span className="tabular-nums">
                      {deliveryFee === 0 ? (subtotal >= orderConfig.delivery.freeDeliveryMinimum ? 'Free' : '—') : `£${deliveryFee.toFixed(2)}`}
                    </span>
                  </div>
                )}
                <div className="flex justify-between font-semibold text-yun-charcoal text-base pt-1">
                  <span>Total</span>
                  <span className="tabular-nums">£{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OrderForm;
