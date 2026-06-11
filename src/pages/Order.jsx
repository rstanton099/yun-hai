import { Link } from 'react-router-dom';
import PageBanner from '../components/PageBanner';
import DecorativeBorder from '../components/DecorativeBorder';
import { orderConfig, restaurantInfo } from '../data/menu';

const options = [
  {
    to: '/takeaway',
    title: 'Pick up from restaurant',
    chinese: '外卖',
    description: 'Order online and collect from Yun Hai. Ready in 20–30 minutes.',
    details: [
      `Collect from ${restaurantInfo.address}`,
      orderConfig.takeaway.readyTime,
      orderConfig.takeaway.payment,
    ],
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
  },
  {
    to: '/delivery',
    title: 'Delivery to your door',
    chinese: '送餐',
    description: 'We bring Yun Hai to you. Add your address at checkout.',
    details: [
      `Within ${orderConfig.delivery.radius}`,
      `£${orderConfig.delivery.fee.toFixed(2)} fee · free over £${orderConfig.delivery.freeDeliveryMinimum}`,
      orderConfig.delivery.readyTime,
    ],
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h8a1 1 0 001-1zm4 0V4a1 1 0 00-1-1h-1M17 16h2a1 1 0 011 1v1a1 1 0 01-1 1h-1m-4-3h4" />
      </svg>
    ),
  },
];

function Order() {
  return (
    <>
      <PageBanner
        title="Order Online"
        chinese="点餐"
        subtitle="Choose collection or delivery — then browse the menu and checkout."
      />

      <section className="py-12 md:py-20 bg-yun-cream">
        <div className="page-container max-w-4xl">
          <div className="text-center mb-10">
            <h2 className="section-heading mb-3">How would you like your order?</h2>
            <DecorativeBorder className="max-w-xs mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {options.map((option) => (
              <Link
                key={option.to}
                to={option.to}
                className="group bg-white p-8 md:p-10 shadow-md border border-yun-gold/20 hover:border-yun-red/40 hover:shadow-lg transition-all duration-300 flex flex-col"
              >
                <div className="text-yun-gold group-hover:text-yun-red transition-colors mb-4">
                  {option.icon}
                </div>
                <p className="font-serif text-yun-gold tracking-widest text-sm mb-1">{option.chinese}</p>
                <h3 className="font-display text-2xl font-semibold text-yun-charcoal mb-2 group-hover:text-yun-red transition-colors">
                  {option.title}
                </h3>
                <p className="text-yun-ink/70 text-sm mb-6 leading-relaxed">{option.description}</p>
                <ul className="text-sm text-yun-ink/60 space-y-1.5 mb-8 flex-1">
                  {option.details.map((detail) => (
                    <li key={detail} className="flex items-start gap-2">
                      <span className="text-yun-gold mt-0.5">·</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
                <span className="inline-flex items-center justify-center h-12 px-6 bg-yun-charcoal text-white font-display text-base tracking-wide group-hover:bg-yun-red transition-colors">
                  Continue
                </span>
              </Link>
            ))}
          </div>

          <p className="text-center text-sm text-yun-ink/50 mt-10">
            Need help? Call{' '}
            <a href={`tel:${restaurantInfo.phone.replace(/\s/g, '')}`} className="text-yun-red hover:underline">
              {restaurantInfo.phone}
            </a>
          </p>
        </div>
      </section>
    </>
  );
}

export default Order;
