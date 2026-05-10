import { Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import Navbar from './Navbar';
import './Layout.css';

function Layout() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="layout">
      <Navbar user={user} onLogout={handleLogout} />
      <main className="layout-main">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
