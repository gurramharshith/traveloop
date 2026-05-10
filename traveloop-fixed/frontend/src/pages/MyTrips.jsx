import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEye, FiEdit2, FiTrash2 } from 'react-icons/fi';
import './MyTrips.css';

function MyTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all | upcoming | past

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const res = await fetch('/api/trips', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await res.json();
      setTrips(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (tripId) => {
    if (!confirm('Delete this trip permanently?')) return;
    try {
      const res = await fetch(`/api/trips/${tripId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (res.ok) setTrips(trips.filter(t => t._id !== tripId));
    } catch (e) {
      console.error(e);
    }
  };

  const now = new Date();
  const filtered = trips.filter(t => {
    if (filter === 'upcoming') return new Date(t.startDate) >= now;
    if (filter === 'past') return new Date(t.endDate) < now;
    return true;
  });

  const getTripStatus = (trip) => {
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    if (now < start) return { label: 'Upcoming', cls: 'upcoming' };
    if (now > end) return { label: 'Completed', cls: 'completed' };
    return { label: 'In Progress', cls: 'inprogress' };
  };

  return (
    <div className="mytrips-container">
      <div className="mytrips-header">
        <div>
          <h1>🧳 My Trips</h1>
          <p>All your travel plans in one place</p>
        </div>
        <Link to="/create-trip" className="btn btn-primary">
          <FiPlus /> New Trip
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        {['all', 'upcoming', 'past'].map(f => (
          <button
            key={f}
            className={`filter-tab ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? `All (${trips.length})` : f === 'upcoming' ? `Upcoming (${trips.filter(t => new Date(t.startDate) >= now).length})` : `Completed (${trips.filter(t => new Date(t.endDate) < now).length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading">Loading your trips...</div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div style={{ fontSize: '56px', marginBottom: '16px' }}>✈️</div>
          <h3>{filter === 'all' ? 'No trips yet' : `No ${filter} trips`}</h3>
          <p>{filter === 'all' ? "You haven't planned any trips yet." : `You have no ${filter} trips.`}</p>
          {filter === 'all' && (
            <Link to="/create-trip" className="btn btn-primary">Create First Trip</Link>
          )}
        </div>
      ) : (
        <div className="trips-list">
          {filtered.map(trip => {
            const status = getTripStatus(trip);
            const totalCost = (trip.stops || []).reduce((acc, s) =>
              acc + (s.activities || []).reduce((a, act) => a + (act.cost || 0), 0) + (s.accommodation?.cost || 0), 0);

            return (
              <div key={trip._id} className="trip-list-card">
                {trip.coverPhoto ? (
                  <img src={trip.coverPhoto} alt={trip.name} className="trip-list-img" />
                ) : (
                  <div className="trip-list-img-placeholder">🌍</div>
                )}
                <div className="trip-list-content">
                  <div className="trip-list-top">
                    <div>
                      <h3>{trip.name}</h3>
                      {trip.description && <p className="trip-list-desc">{trip.description}</p>}
                    </div>
                    <span className={`trip-status ${status.cls}`}>{status.label}</span>
                  </div>
                  <div className="trip-list-meta">
                    <span>📅 {new Date(trip.startDate).toLocaleDateString()} → {new Date(trip.endDate).toLocaleDateString()}</span>
                    <span>🏙️ {trip.stops?.length || 0} destinations</span>
                    <span>💰 Budget: ${(trip.budget || 0).toLocaleString()}</span>
                    {totalCost > 0 && <span>💳 Estimated: ${totalCost.toLocaleString()}</span>}
                    {trip.isPublic && <span>🌐 Public</span>}
                  </div>
                  <div className="trip-list-actions">
                    <Link to={`/trip/${trip._id}`} className="btn btn-primary">
                      <FiEye /> View
                    </Link>
                    <Link to={`/trip/${trip._id}/builder`} className="btn btn-secondary">
                      <FiEdit2 /> Edit
                    </Link>
                    <button onClick={() => handleDelete(trip._id)} className="btn btn-danger-soft">
                      <FiTrash2 /> Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MyTrips;
