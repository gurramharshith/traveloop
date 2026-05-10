import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './ItineraryBuilder.css';

function ItineraryBuilder() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [stops, setStops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddStop, setShowAddStop] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(null); // stopId
  const [citySearch, setCitySearch] = useState('');
  const [cityResults, setCityResults] = useState([]);
  const [newStop, setNewStop] = useState({ city: '', country: '', startDate: '', endDate: '' });
  const [newActivity, setNewActivity] = useState({ name: '', category: 'sightseeing', description: '', cost: '', duration: '', time: '' });
  const [dragOver, setDragOver] = useState(null);
  const [dragItem, setDragItem] = useState(null);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  useEffect(() => { fetchTrip(); }, [id]);

  const fetchTrip = async () => {
    try {
      const res = await fetch(`/api/trips/${id}`, { headers });
      const data = await res.json();
      setTrip(data);
      setStops(data.stops || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const searchCities = async (q) => {
    setCitySearch(q);
    if (q.length < 2) { setCityResults([]); return; }
    try {
      const res = await fetch(`/api/cities/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setCityResults(data);
    } catch (e) { console.error(e); }
  };

  const selectCity = (city) => {
    setNewStop({ ...newStop, city: city.name, country: city.country });
    setCitySearch(city.name);
    setCityResults([]);
  };

  const addStop = async () => {
    if (!newStop.city || !newStop.startDate || !newStop.endDate) return alert('Fill in city and dates');
    try {
      const res = await fetch('/api/stops', {
        method: 'POST',
        headers,
        body: JSON.stringify({ ...newStop, tripId: id }),
      });
      if (res.ok) {
        setShowAddStop(false);
        setNewStop({ city: '', country: '', startDate: '', endDate: '' });
        setCitySearch('');
        fetchTrip();
      }
    } catch (e) { console.error(e); }
  };

  const deleteStop = async (stopId) => {
    if (!confirm('Remove this stop?')) return;
    await fetch(`/api/stops/${stopId}`, { method: 'DELETE', headers });
    fetchTrip();
  };

  const addActivity = async (stopId) => {
    if (!newActivity.name) return alert('Activity name required');
    try {
      const res = await fetch('/api/activities', {
        method: 'POST',
        headers,
        body: JSON.stringify({ ...newActivity, stopId, cost: Number(newActivity.cost) || 0, duration: Number(newActivity.duration) || 0 }),
      });
      if (res.ok) {
        setShowActivityModal(null);
        setNewActivity({ name: '', category: 'sightseeing', description: '', cost: '', duration: '', time: '' });
        fetchTrip();
      }
    } catch (e) { console.error(e); }
  };

  const deleteActivity = async (activityId) => {
    await fetch(`/api/activities/${activityId}`, { method: 'DELETE', headers });
    fetchTrip();
  };

  const handleDragStart = (idx) => setDragItem(idx);
  const handleDragOver = (e, idx) => { e.preventDefault(); setDragOver(idx); };
  const handleDrop = async (idx) => {
    if (dragItem === null || dragItem === idx) return;
    const reordered = [...stops];
    const [moved] = reordered.splice(dragItem, 1);
    reordered.splice(idx, 0, moved);
    setStops(reordered);
    setDragItem(null);
    setDragOver(null);
    await fetch('/api/stops/reorder', {
      method: 'POST',
      headers,
      body: JSON.stringify({ tripId: id, stopIds: reordered.map(s => s._id) }),
    });
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="builder-container">
      <div className="builder-header">
        <div>
          <h1>Itinerary Builder</h1>
          <p>{trip?.name}</p>
        </div>
        <div className="builder-header-actions">
          <Link to={`/trip/${id}`} className="btn btn-outline">← Back to Trip</Link>
          <button className="btn btn-primary" onClick={() => setShowAddStop(true)}>+ Add Stop</button>
        </div>
      </div>

      {stops.length === 0 ? (
        <div className="empty-builder">
          <h2>No stops yet</h2>
          <p>Start adding cities to your itinerary</p>
          <button className="btn btn-primary" onClick={() => setShowAddStop(true)}>Add First Stop</button>
        </div>
      ) : (
        <div className="stops-timeline">
          {stops.map((stop, idx) => (
            <div
              key={stop._id}
              className={`stop-block ${dragOver === idx ? 'drag-over' : ''}`}
              draggable
              onDragStart={() => handleDragStart(idx)}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDrop={() => handleDrop(idx)}
            >
              <div className="stop-block-header">
                <div className="stop-drag-handle">⋮⋮</div>
                <div className="stop-info">
                  <h3>📍 {stop.city}{stop.country ? `, ${stop.country}` : ''}</h3>
                  <span>{new Date(stop.startDate).toLocaleDateString()} → {new Date(stop.endDate).toLocaleDateString()}</span>
                </div>
                <div className="stop-block-actions">
                  <button className="btn btn-sm btn-secondary" onClick={() => setShowActivityModal(stop._id)}>+ Activity</button>
                  <button className="btn btn-sm btn-danger" onClick={() => deleteStop(stop._id)}>🗑</button>
                </div>
              </div>

              {stop.activities && stop.activities.length > 0 && (
                <div className="activities-list">
                  {stop.activities.map(act => (
                    <div key={act._id} className="activity-item">
                      <div className="activity-info">
                        <span className="activity-category">{act.category}</span>
                        <span className="activity-name">{act.name}</span>
                        {act.time && <span className="activity-time">🕐 {act.time}</span>}
                        {act.cost > 0 && <span className="activity-cost">💰 ${act.cost}</span>}
                        {act.duration > 0 && <span className="activity-duration">⏱ {act.duration}h</span>}
                      </div>
                      <button className="btn-icon" onClick={() => deleteActivity(act._id)}>✕</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Stop Modal */}
      {showAddStop && (
        <div className="modal-overlay" onClick={() => setShowAddStop(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Add a Stop</h2>

            <div className="form-group" style={{ position: 'relative' }}>
              <label>Search City</label>
              <input
                type="text"
                value={citySearch}
                onChange={e => searchCities(e.target.value)}
                placeholder="Search for a city..."
              />
              {cityResults.length > 0 && (
                <div className="city-dropdown">
                  {cityResults.map(city => (
                    <div key={city._id} className="city-option" onClick={() => selectCity(city)}>
                      <strong>{city.name}</strong>, {city.country}
                      <span className="city-meta">Cost Index: {city.costIndex}/10</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="form-group">
              <label>City (manual)</label>
              <input type="text" value={newStop.city} onChange={e => setNewStop({ ...newStop, city: e.target.value })} placeholder="City name" />
            </div>
            <div className="form-group">
              <label>Country</label>
              <input type="text" value={newStop.country} onChange={e => setNewStop({ ...newStop, country: e.target.value })} placeholder="Country" />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Arrival Date</label>
                <input type="date" value={newStop.startDate} onChange={e => setNewStop({ ...newStop, startDate: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Departure Date</label>
                <input type="date" value={newStop.endDate} onChange={e => setNewStop({ ...newStop, endDate: e.target.value })} />
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-primary" onClick={addStop}>Add Stop</button>
              <button className="btn btn-outline" onClick={() => setShowAddStop(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Activity Modal */}
      {showActivityModal && (
        <div className="modal-overlay" onClick={() => setShowActivityModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Add Activity</h2>
            <div className="form-group">
              <label>Activity Name *</label>
              <input type="text" value={newActivity.name} onChange={e => setNewActivity({ ...newActivity, name: e.target.value })} placeholder="e.g., Eiffel Tower Visit" />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select value={newActivity.category} onChange={e => setNewActivity({ ...newActivity, category: e.target.value })}>
                <option value="sightseeing">Sightseeing</option>
                <option value="food">Food</option>
                <option value="adventure">Adventure</option>
                <option value="culture">Culture</option>
                <option value="relaxation">Relaxation</option>
                <option value="shopping">Shopping</option>
                <option value="nightlife">Nightlife</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea value={newActivity.description} onChange={e => setNewActivity({ ...newActivity, description: e.target.value })} rows="2" />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Time</label>
                <input type="time" value={newActivity.time} onChange={e => setNewActivity({ ...newActivity, time: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Duration (hours)</label>
                <input type="number" value={newActivity.duration} onChange={e => setNewActivity({ ...newActivity, duration: e.target.value })} min="0" step="0.5" />
              </div>
              <div className="form-group">
                <label>Cost ($)</label>
                <input type="number" value={newActivity.cost} onChange={e => setNewActivity({ ...newActivity, cost: e.target.value })} min="0" />
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-primary" onClick={() => addActivity(showActivityModal)}>Add Activity</button>
              <button className="btn btn-outline" onClick={() => setShowActivityModal(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ItineraryBuilder;
