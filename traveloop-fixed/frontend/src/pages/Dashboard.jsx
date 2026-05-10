import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEye, FiTrash2 } from 'react-icons/fi';
import { useTripStore } from '../stores/tripStore';
import { useAuthStore } from '../stores/authStore';
import './Dashboard.css';

const RECOMMENDED = [
  { name: 'Paris', country: 'France', emoji: '🗼', desc: 'City of Light & Love', cost: '$$' },
  { name: 'Tokyo', country: 'Japan', emoji: '🗾', desc: 'Neon lights & ancient temples', cost: '$$' },
  { name: 'Bali', country: 'Indonesia', emoji: '🌴', desc: 'Tropical paradise', cost: '$' },
  { name: 'New York', country: 'USA', emoji: '🗽', desc: 'The city that never sleeps', cost: '$$$' },
  { name: 'Barcelona', country: 'Spain', emoji: '🏖️', desc: 'Art, architecture & beaches', cost: '$$' },
  { name: 'Cape Town', country: 'South Africa', emoji: '🌄', desc: 'Mountains meet the ocean', cost: '$' },
];

function Dashboard() {
  const { trips, setTrips } = useTripStore();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const response = await fetch('/api/trips', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await response.json();
      setTrips(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching trips:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTrip = async (tripId) => {
    if (!confirm('Are you sure you want to delete this trip?')) return;
    try {
      const response = await fetch(`/api/trips/${tripId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (response.ok) await fetchTrips();
    } catch (error) {
      console.error('Error deleting trip:', error);
    }
  };

  const totalBudgetAllTrips = trips.reduce((acc, t) => acc + (t.budget || 0), 0);
  const upcomingTrips = trips.filter(t => new Date(t.startDate) >= new Date());
  const completedTrips = trips.filter(t => new Date(t.endDate) < new Date());

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="dashboard-container">

      {/* Welcome Banner */}
      <div className="welcome-banner">
        <div className="welcome-text">
          <h1>{getGreeting()}, {user?.name?.split(' ')[0] || 'Traveler'} ✈️</h1>
          <p>Ready to plan your next adventure? The world is waiting for you.</p>
        </div>
        <Link to="/create-trip" className="btn btn-primary btn-lg">
          <FiPlus /> Plan New Trip
        </Link>
      </div>

      {/* Budget Highlights */}
      {trips.length > 0 && (
        <div className="budget-highlights">
          <div className="highlight-card">
            <span className="highlight-icon">✈️</span>
            <div>
              <div className="highlight-value">{trips.length}</div>
              <div className="highlight-label">Total Trips</div>
            </div>
          </div>
          <div className="highlight-card">
            <span className="highlight-icon">🗓️</span>
            <div>
              <div className="highlight-value">{upcomingTrips.length}</div>
              <div className="highlight-label">Upcoming</div>
            </div>
          </div>
          <div className="highlight-card">
            <span className="highlight-icon">✅</span>
            <div>
              <div className="highlight-value">{completedTrips.length}</div>
              <div className="highlight-label">Completed</div>
            </div>
          </div>
          <div className="highlight-card">
            <span className="highlight-icon">💰</span>
            <div>
              <div className="highlight-value">${totalBudgetAllTrips.toLocaleString()}</div>
              <div className="highlight-label">Total Budget</div>
            </div>
          </div>
        </div>
      )}

      {/* My Trips Section */}
      <div className="dashboard-section">
        <div className="section-header">
          <h2>My Recent Trips</h2>
          {trips.length > 0 && (
            <Link to="/my-trips" className="see-all-link">See all →</Link>
          )}
        </div>

        {loading ? (
          <div className="loading">Loading trips...</div>
        ) : trips.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🗺️</div>
            <h3>No trips yet</h3>
            <p>Start planning your first adventure!</p>
            <Link to="/create-trip" className="btn btn-primary">
              <FiPlus /> Create Your First Trip
            </Link>
          </div>
        ) : (
          <div className="trips-grid">
            {trips.slice(0, 4).map((trip) => (
              <div key={trip._id} className="trip-card">
                {trip.coverPhoto ? (
                  <img src={trip.coverPhoto} alt={trip.name} className="trip-image" />
                ) : (
                  <div className="trip-image-placeholder"><span>🌍</span></div>
                )}
                <div className="trip-content">
                  <h3>{trip.name}</h3>
                  {trip.description && <p className="trip-description">{trip.description}</p>}
                  <div className="trip-info">
                    <span>📅 {new Date(trip.startDate).toLocaleDateString()} – {new Date(trip.endDate).toLocaleDateString()}</span>
                    <span>🏙️ {trip.stops?.length || 0} stops</span>
                    {trip.budget > 0 && <span>💰 ${trip.budget.toLocaleString()}</span>}
                  </div>
                  <div className="trip-actions">
                    <Link to={`/trip/${trip._id}`} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <FiEye /> View
                    </Link>
                    <button onClick={() => handleDeleteTrip(trip._id)} className="btn btn-danger" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <FiTrash2 /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recommended Destinations */}
      <div className="dashboard-section">
        <div className="section-header">
          <h2>🌟 Recommended Destinations</h2>
          <Link to="/cities" className="see-all-link">Explore all →</Link>
        </div>
        <div className="recommended-grid">
          {RECOMMENDED.map((dest) => (
            <div key={dest.name} className="recommended-card">
              <div className="recommended-emoji">{dest.emoji}</div>
              <div className="recommended-info">
                <h4>{dest.name}</h4>
                <p>{dest.country}</p>
                <span className="recommended-desc">{dest.desc}</span>
              </div>
              <span className="recommended-cost">{dest.cost}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default Dashboard;
