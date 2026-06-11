import { restaurantInfo } from '../data/menu';

function HoursWidget({ compact = false }) {
  const { hours } = restaurantInfo;

  if (compact) {
    return (
      <div className="text-sm space-y-1">
        <p><span className="text-yun-gold font-medium">{hours.weekday.days}:</span> {hours.weekday.time}</p>
        <p><span className="text-yun-gold font-medium">{hours.weekend.days}:</span> {hours.weekend.time}</p>
      </div>
    );
  }

  return (
    <div className="bg-yun-charcoal text-white p-6 md:p-8">
      <h3 className="font-display text-xl text-yun-gold mb-4">Opening Hours</h3>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between border-b border-white/10 pb-2">
          <span className="text-white/70">{hours.weekday.days}</span>
          <span>{hours.weekday.time}</span>
        </div>
        <div className="flex justify-between border-b border-white/10 pb-2">
          <span className="text-white/70">{hours.weekend.days}</span>
          <span>{hours.weekend.time}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/70">{hours.lunch.days}</span>
          <span className="text-yun-gold">{hours.lunch.time}</span>
        </div>
      </div>
    </div>
  );
}

export default HoursWidget;
