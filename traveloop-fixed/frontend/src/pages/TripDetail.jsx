import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './TripDetail.css';

function TripDetail() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [makingPublic, setMakingPublic] = useState(false);
  const [publicMsg, setPublicMsg] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'calendar'

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  useEffect(() => { fetchTrip(); }, [id]);

  const fetchTrip = async () => {
    try {
      const response = await fetch(`/api/trips/${id}`, { headers });
      const data = await response.json();
      setTrip(data);
    } catch (error) {
      console.error('Error fetching trip:', error);
    } finally {
      setLoading(false);
    }
  };

  const togglePublic = async () => {
    setMakingPublic(true);
    try {
      const res = await fetch(`/api/trips/${id}`, {
        method: 'PUT', headers,
        body: JSON.stringify({ isPublic: !trip.isPublic }),
      });
      const data = await res.json();
      setTrip(data.trip);
      setPublicMsg(data.trip.isPublic ? 'Trip is now public! Share the link below.' : 'Trip is now private.');
      setTimeout(() => setPublicMsg(''), 3000);
    } catch (e) { console.error(e); }
    finally { setMakingPublic(false); }
  };

  const copyPublicLink = () => {
    const url = `${window.location.origin}/trip/public/${id}`;
    navigator.clipboard.writeText(url);
    setPublicMsg('Link copied!');
    setTimeout(() => setPublicMsg(''), 2000);
  };

  if (loading) return <div className="loading">Loading trip...</div>;
  if (!trip) return <div className="error">Trip not found</div>;

  const totalCost = (trip.stops || []).reduce((acc, stop) =>
    acc + (stop.activities || []).reduce((a, act) => a + (act.cost || 0), 0) + (stop.accommodation?.cost || 0), 0);

  // Build calendar: day-by-day breakdown
  const buildCalendar = () => {
    if (!trip.startDate || !trip.endDate) return [];
    const days = [];
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    let current = new Date(start);
    while (current <= end) {
      const dateStr = current.toISOString().split('T')[0];
      // Find stops that cover this day
      const stopsOnDay = (trip.stops || []).filter(s => {
        const sd = new Date(s.startDate);
        const ed = new Date(s.endDate);
        return current >= sd && current <= ed;
      });
      days.push({ date: new Date(current), dateStr, stops: stopsOnDay });
      current.setDate(current.getDate() + 1);
    }
    return days;
  };

  const calendarDays = buildCalendar();

  return (
    <div className="trip-detail-container">
      <div className="trip-detail-header">
        {trip.coverPhoto && <img src={trip.coverPhoto} alt={trip.name} className="trip-cover" />}
        <h1>{trip.name}</h1>
        {trip.description && <p>{trip.description}</p>}
      </div>

      {/* Quick Stats */}
      <div className="trip-summary">
        <div className="summary-item">
          <h3>📅 Duration</h3>
          <p>{new Date(trip.startDate).toLocaleDateString()} – {new Date(trip.endDate).toLocaleDateString()}</p>
        </div>
        <div className="summary-item">
          <h3>💰 Budget</h3>
          <p>${trip.budget?.toLocaleString() || 0}</p>
        </div>
        <div className="summary-item">
          <h3>🏙️ Stops</h3>
          <p>{trip.stops?.length || 0} cities</p>
        </div>
        <div className="summary-item">
          <h3>💳 Estimated</h3>
          <p>${totalCost.toLocaleString()}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="trip-detail-actions">
        <Link to={`/trip/${trip._id}/builder`} className="btn btn-primary">✏️ Edit Itinerary</Link>
        <Link to={`/trip/${trip._id}/budget`} className="btn btn-secondary">💰 Budget</Link>
        <Link to={`/trip/${trip._id}/checklist`} className="btn btn-secondary">🎒 Checklist</Link>
        <Link to={`/trip/${trip._id}/notes`} className="btn btn-secondary">📓 Notes</Link>
        <button
          onClick={togglePublic}
          className={`btn ${trip.isPublic ? 'btn-danger-soft' : 'btn-secondary'}`}
          disabled={makingPublic}
        >
          {trip.isPublic ? '🔒 Make Private' : '🌐 Share Trip'}
        </button>
        {trip.isPublic && (
          <button className="btn btn-outline" onClick={copyPublicLink}>🔗 Copy Link</button>
        )}
      </div>

      {publicMsg && <div className="public-message">{publicMsg}</div>}

      {trip.isPublic && (
        <div className="public-link-bar">
          <span>Public URL: </span>
          <a href={`/trip/public/${id}`} target="_blank" rel="noreferrer">
            {window.location.origin}/trip/public/{id}
          </a>
        </div>
      )}

      {/* View Mode Toggle */}
      {trip.stops && trip.stops.length > 0 && (
        <div className="itinerary-section">
          <div className="itinerary-header">
            <h2>Itinerary</h2>
            <div className="view-toggle">
              <button
                className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                ☰ List
              </button>
              <button
                className={`toggle-btn ${viewMode === 'calendar' ? 'active' : ''}`}
                onClick={() => setViewMode('calendar')}
              >
                📅 Calendar
              </button>
            </div>
          </div>

          {/* List View */}
          {viewMode === 'list' && (
            <div className="stops-list">
              {trip.stops.map((stop, index) => (
                <div key={stop._id} className="stop-item">
                  <div className="stop-number">{index + 1}</div>
                  <div className="stop-details">
                    <h3>📍 {stop.city}{stop.country ? `, ${stop.country}` : ''}</h3>
                    <p className="stop-dates">
                      {new Date(stop.startDate).toLocaleDateString()} → {new Date(stop.endDate).toLocaleDateString()}
                    </p>
                    {stop.activities && stop.activities.length > 0 && (
                      <div className="stop-activities-list">
                        {stop.activities.map(act => (
                          <div key={act._id} className="activity-row">
                            <span className="act-name">{act.name}</span>
                            <span className="act-cat">{act.category}</span>
                            {act.cost > 0 && <span className="act-cost">${act.cost}</span>}
                            {act.duration > 0 && <span className="act-dur">{act.duration}h</span>}
                          </div>
                        ))}
                      </div>
                    )}
                    <p className="stop-activity-count">{stop.activities?.length || 0} activities</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Calendar View */}
          {viewMode === 'calendar' && (
            <div className="calendar-view">
              {calendarDays.length === 0 ? (
                <p style={{ color: '#9ca3af', textAlign: 'center', padding: '24px' }}>No date range set for this trip.</p>
              ) : (
                calendarDays.map((day, i) => (
                  <div key={day.dateStr} className="calendar-day">
                    <div className="calendar-day-header">
                      <span className="day-number">Day {i + 1}</span>
                      <span className="day-date">
                        {day.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    {day.stops.length === 0 ? (
                      <p className="no-stop-day">🌤️ Travel / Rest Day</p>
                    ) : (
                      day.stops.map(stop => (
                        <div key={stop._id} className="calendar-stop">
                          <div className="cal-stop-city">📍 {stop.city}</div>
                          {(stop.activities || []).map(act => (
                            <div key={act._id} className="cal-activity">
                              <span>• {act.name}</span>
                              <div className="cal-act-meta">
                                {act.time && <span>🕐 {act.time}</span>}
                                {act.cost > 0 && <span>💰 ${act.cost}</span>}
                              </div>
                            </div>
                          ))}
                          {(stop.activities || []).length === 0 && (
                            <p className="no-activities-day">No activities planned</p>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default TripDetail;
