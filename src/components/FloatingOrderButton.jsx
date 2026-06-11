import { Link, useLocation } from 'react-router-dom';

function FloatingOrderButton() {
  const location = useLocation();
  const onOrderFlow = ['/order', '/takeaway', '/delivery'].includes(location.pathname);
  if (onOrderFlow) return null;

  return (
    <Link
      to="/order"
      className="fixed bottom-6 right-6 z-40 px-6 py-3.5 bg-yun-red text-white shadow-lg font-display text-base font-medium tracking-wide hover:bg-yun-red-dark transition-all"
      aria-label="Order online"
    >
      Order Online
    </Link>
  );
}

export default FloatingOrderButton;
