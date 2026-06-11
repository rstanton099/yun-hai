import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { clearAdminToken, getAdminToken, adminLogout } from '../../utils/api';

const navItems = [
  { to: '/admin/bookings', label: 'Bookings' },
  { to: '/admin/orders', label: 'Takeaway / Delivery' },
  { to: '/admin/schedule', label: 'Schedule' },
  { to: '/admin/settings', label: 'Settings' },
];

function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const token = getAdminToken();

  useEffect(() => {
    if (!token) {
      navigate('/admin/login', { replace: true });
    }
  }, [token, navigate]);

  const handleLogout = async () => {
    await adminLogout();
    clearAdminToken();
    navigate('/admin/login', { replace: true });
  };

  if (!token) return null;

  return (
    <div className="admin-shell">
      <header className="bg-yun-charcoal text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-yun-red flex items-center justify-center font-serif text-yun-gold text-sm font-bold">
                云
              </div>
              <div>
                <h1 className="font-admin text-base font-semibold tracking-tight">Yun Hai Admin</h1>
                <p className="text-xs text-white/50">Reservation management</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="admin-btn-ghost text-white/70 hover:text-white hover:bg-white/10"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <nav className="flex gap-2 mb-8">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={
                location.pathname === item.to
                  ? 'admin-nav-link-active'
                  : 'admin-nav-link-inactive'
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
