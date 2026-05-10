import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import './AdminDashboard.css';

function AdminDashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [trips, setTrips] = useState([]);
  const [topCities, setTopCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  useEffect(() => {
    // Only admin can access this
    if (user && user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchAdminData();
  }, [user]);

  const fetchAdminData = async () => {
    try {
      const [usersRes, tripsRes, citiesRes] = await Promise.all([
        fetch('/api/admin/users', { headers }),
        fetch('/api/admin/trips', { headers }),
        fetch('/api/cities/popular', { headers }),
      ]);

      const usersData = usersRes.ok ? await usersRes.json() : [];
      const tripsData = tripsRes.ok ? await tripsRes.json() : [];
      const citiesData = citiesRes.ok ? await citiesRes.json() : [];

      const userList = Array.isArray(usersData) ? usersData : usersData.users || [];
      const tripList = Array.isArray(tripsData) ? tripsData : tripsData.trips || [];

      setUsers(userList);
      setTrips(tripList);
      setTopCities(Array.isArray(citiesData) ? citiesData.slice(0, 6) : []);

      // Compute stats
      const totalBudget = tripList.reduce((acc, t) => acc + (t.budget || 0), 0);
      const totalStops = tripList.reduce((acc, t) => acc + (t.stops?.length || 0), 0);
      setStats({
        totalUsers: userList.length,
        totalTrips: tripList.length,
        totalStops,
        avgBudget: tripList.length > 0 ? Math.round(totalBudget / tripList.length) : 0,
      });
    } catch (e) {
      console.error('Admin data error:', e);
      // Set mock stats for demo if API not set up
      setStats({ totalUsers: 0, totalTrips: 0, totalStops: 0, avgBudget: 0 });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Delete this user and all their data?')) return;
    try {
      await fetch(`/api/admin/users/${userId}`, { method: 'DELETE', headers });
      setUsers(users.filter(u => u._id !== userId));
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div className="loading" style={{ textAlign: 'center', padding: '60px' }}>Loading admin data...</div>;

  return (
    <div className="admin-container">
      <div className="admin-header">
        <div>
          <h1>🛡️ Admin Dashboard</h1>
          <p>Platform overview and user management</p>
        </div>
        <Link to="/" className="btn btn-outline">← Back to App</Link>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        {['overview', 'users', 'trips', 'cities'].map(tab => (
          <button
            key={tab}
            className={`admin-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {{ overview: '📊 Overview', users: '👥 Users', trips: '✈️ Trips', cities: '🌍 Cities' }[tab]}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && stats && (
        <>
          <div className="stat-cards">
            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-value">{stats.totalUsers}</div>
              <div className="stat-label">Total Users</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">✈️</div>
              <div className="stat-value">{stats.totalTrips}</div>
              <div className="stat-label">Trips Created</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📍</div>
              <div className="stat-value">{stats.totalStops}</div>
              <div className="stat-label">Total Stops</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">💰</div>
              <div className="stat-value">${stats.avgBudget.toLocaleString()}</div>
              <div className="stat-label">Avg Trip Budget</div>
            </div>
          </div>

          {/* Bar chart: trips per month (last 6) */}
          <div className="admin-section">
            <h2>Platform Activity</h2>
            {trips.length === 0 ? (
              <p className="empty-note">No trip data yet.</p>
            ) : (
              <div className="bar-chart">
                {(() => {
                  const months = {};
                  trips.forEach(t => {
                    const d = new Date(t.createdAt || t.startDate);
                    if (!isNaN(d)) {
                      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
                      months[key] = (months[key] || 0) + 1;
                    }
                  });
                  const sorted = Object.entries(months).sort((a, b) => a[0].localeCompare(b[0])).slice(-6);
                  const max = Math.max(...sorted.map(([, v]) => v), 1);
                  return sorted.map(([month, count]) => (
                    <div key={month} className="bar-item">
                      <div className="bar-fill" style={{ height: `${(count / max) * 120}px` }} />
                      <div className="bar-count">{count}</div>
                      <div className="bar-label">{month.slice(5)}/{month.slice(2, 4)}</div>
                    </div>
                  ));
                })()}
              </div>
            )}
          </div>
        </>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="admin-section">
          <h2>User Management ({users.length})</h2>
          {users.length === 0 ? (
            <p className="empty-note">No users found.</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id}>
                    <td>
                      <div className="user-row">
                        <div className="user-avatar-sm">{u.name?.[0]?.toUpperCase()}</div>
                        {u.name}
                      </div>
                    </td>
                    <td>{u.email}</td>
                    <td>
                      <span className={`role-badge ${u.role === 'admin' ? 'admin' : 'user'}`}>
                        {u.role || 'user'}
                      </span>
                    </td>
                    <td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}</td>
                    <td>
                      {u._id !== user?._id && (
                        <button
                          className="btn-delete-sm"
                          onClick={() => handleDeleteUser(u._id)}
                        >
                          🗑️ Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Trips Tab */}
      {activeTab === 'trips' && (
        <div className="admin-section">
          <h2>All Trips ({trips.length})</h2>
          {trips.length === 0 ? (
            <p className="empty-note">No trips found.</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Trip Name</th>
                  <th>Stops</th>
                  <th>Budget</th>
                  <th>Public</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {trips.map(t => (
                  <tr key={t._id}>
                    <td><strong>{t.name}</strong></td>
                    <td>{t.stops?.length || 0}</td>
                    <td>${(t.budget || 0).toLocaleString()}</td>
                    <td>{t.isPublic ? '🌐 Yes' : '🔒 No'}</td>
                    <td>{t.createdAt ? new Date(t.createdAt).toLocaleDateString() : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Cities Tab */}
      {activeTab === 'cities' && (
        <div className="admin-section">
          <h2>Popular Cities</h2>
          {topCities.length === 0 ? (
            <p className="empty-note">No city data available.</p>
          ) : (
            <div className="cities-stat-grid">
              {topCities.map((city, i) => (
                <div key={city._id} className="city-stat-card">
                  <div className="city-rank">#{i + 1}</div>
                  <div>
                    <h3>{city.name}</h3>
                    <p>{city.country}</p>
                    {city.popularity && <span className="pop-badge">⭐ {city.popularity}/100</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
