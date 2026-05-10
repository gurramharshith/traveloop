import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiLogOut, FiUser, FiHome, FiList, FiMap, FiCompass } from 'react-icons/fi';
import './Navbar.css';

function Navbar({ user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? 'navbar-link active' : 'navbar-link';

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          ✈️ Traveloop
        </Link>
        <div className="navbar-menu">
          <Link to="/" className={isActive('/')}>
            <FiHome /> Home
          </Link>
          <Link to="/my-trips" className={isActive('/my-trips')}>
            <FiList /> My Trips
          </Link>
          <Link to="/cities" className={isActive('/cities')}>
            <FiMap /> Cities
          </Link>
          <Link to="/activities" className={isActive('/activities')}>
            <FiCompass /> Activities
          </Link>
          <div className="navbar-user">
            <span className="user-name">{user?.name}</span>
            <Link to="/profile" className={isActive('/profile')}>
              <FiUser /> Profile
            </Link>
            {user?.role === 'admin' && (
              <Link to="/admin" className={isActive('/admin')}>
                🛡️ Admin
              </Link>
            )}
            <button onClick={onLogout} className="btn-logout">
              <FiLogOut /> Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
