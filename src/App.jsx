import { BrowserRouter, Routes, Route, useLocation, Navigate, Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import FloatingOrderButton from './components/FloatingOrderButton';
import Home from './pages/Home';
import Menu from './pages/Menu';
import About from './pages/About';
import Gallery from './pages/Gallery';
import Reservations from './pages/Reservations';
import Contact from './pages/Contact';
import Order from './pages/Order';
import Takeaway from './pages/Takeaway';
import Delivery from './pages/Delivery';
import AdminLayout from './pages/admin/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import AdminBookings from './pages/admin/AdminBookings';
import AdminSchedule from './pages/admin/AdminSchedule';
import AdminSettings from './pages/admin/AdminSettings';
import AdminOrders from './pages/admin/AdminOrders';

function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-yun-cream">
      <Navigation />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <FloatingOrderButton />
    </div>
  );
}

function AppContent() {
  const location = useLocation();

  useEffect(() => {
    const pageTitles = {
      '/': 'Yun Hai — Chinese Restaurant',
      '/menu': 'Yun Hai — Menu',
      '/about': 'Yun Hai — Our Story',
      '/gallery': 'Yun Hai — Gallery',
      '/reservations': 'Yun Hai — Reservations',
      '/contact': 'Yun Hai — Contact',
      '/order': 'Yun Hai — Order Online',
      '/takeaway': 'Yun Hai — Takeaway',
      '/delivery': 'Yun Hai — Delivery',
      '/admin/login': 'Yun Hai — Admin Login',
      '/admin/bookings': 'Yun Hai — Admin Bookings',
      '/admin/schedule': 'Yun Hai — Admin Schedule',
      '/admin/settings': 'Yun Hai — Admin Settings',
      '/admin/orders': 'Yun Hai — Takeaway & Delivery',
    };

    document.title = pageTitles[location.pathname] || 'Yun Hai';
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/about" element={<About />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/reservations" element={<Reservations />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/order" element={<Order />} />
        <Route path="/takeaway" element={<Takeaway />} />
        <Route path="/delivery" element={<Delivery />} />
      </Route>

      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/bookings" replace />} />
        <Route path="bookings" element={<AdminBookings />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="schedule" element={<AdminSchedule />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
