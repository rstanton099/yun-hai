import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogin, setAdminToken, verifyAdminSession } from '../../utils/api';

function AdminLogin() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    verifyAdminSession().then((valid) => {
      if (valid) navigate('/admin/bookings', { replace: true });
    });
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { token } = await adminLogin(password);
      setAdminToken(token);
      navigate('/admin/bookings', { replace: true });
    } catch (err) {
      const message = err.message || '';
      if (message.includes('reservation server')) {
        setError(message);
      } else if (message.toLowerCase().includes('invalid password')) {
        setError('Invalid password. Please try again.');
      } else if (message === 'Failed to fetch' || message.includes('NetworkError')) {
        setError('Cannot reach the server. If this is on Render, wait a minute for the app to wake up and try again.');
      } else {
        setError(message || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-shell flex items-center justify-center px-4">
      <div className="w-full max-w-md admin-card p-8">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-yun-red flex items-center justify-center font-serif text-yun-gold text-lg font-bold mx-auto mb-4">
            云
          </div>
          <h1 className="font-admin text-2xl font-semibold text-yun-charcoal tracking-tight">Staff Login</h1>
          <p className="text-sm text-gray-500 mt-2 font-admin">Yun Hai reservation management</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-yun-ink mb-1 font-admin">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="admin-input w-full py-3"
            />
          </div>

          {error && (
            <p className="text-sm text-yun-red bg-red-50 px-3 py-2 rounded-lg font-admin">{error}</p>
          )}

          <button type="submit" disabled={loading} className="admin-btn-primary w-full py-3 disabled:opacity-50">
            {loading ? 'Signing in…' : 'Sign In'}
          </button>

          <p className="text-xs text-gray-400 text-center pt-2 font-admin">
            Default password: yunhai-admin (unless ADMIN_PASSWORD is set on the server)
          </p>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
