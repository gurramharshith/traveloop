import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ActivitySearch.css';

const CATEGORIES = ['all', 'sightseeing', 'food', 'adventure', 'culture', 'relaxation', 'shopping', 'nightlife', 'other'];
const CATEGORY_ICONS = {
  all: '🔍', sightseeing: '🗺️', food: '🍜', adventure: '🧗',
  culture: '🏛️', relaxation: '🧘', shopping: '🛍️', nightlife: '🎵', other: '⭐',
};

function ActivitySearch() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [maxCost, setMaxCost] = useState('');
  const [maxDuration, setMaxDuration] = useState('');
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [trips, setTrips] = useState([]);
  const [addingTo, setAddingTo] = useState(null); // activityId being added
  const [addModal, setAddModal] = useState(null); // { activity }
  const [selectedTrip, setSelectedTrip] = useState('');
  const [selectedStop, setSelectedStop] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  useEffect(() => {
    fetchActivities();
    fetchTrips();
  }, []);

  const fetchActivities = async (params = {}) => {
    setLoading(true);
    try {
      const p = new URLSearchParams();
      if (params.q) p.append('q', params.q);
      if (params.category && params.category !== 'all') p.append('category', params.category);
      if (params.maxCost) p.append('maxCost', params.maxCost);
      if (params.maxDuration) p.append('maxDuration', params.maxDuration);
      const res = await fetch(`/api/activities/search?${p.toString()}`, { headers });
      const data = await res.json();
      setActivities(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrips = async () => {
    try {
      const res = await fetch('/api/trips', { headers });
      const data = await res.json();
      setTrips(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSearch = () => {
    fetchActivities({ q: query, category, maxCost, maxDuration });
  };

  const openAddModal = (activity) => {
    setAddModal({ activity });
    setSelectedTrip('');
    setSelectedStop('');
  };

  const closeAddModal = () => {
    setAddModal(null);
    setSelectedTrip('');
    setSelectedStop('');
  };

  const handleAddToTrip = async () => {
    if (!selectedStop) return alert('Please select a stop');
    try {
      setAddingTo(addModal.activity._id);
      const res = await fetch('/api/activities', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: addModal.activity.name,
          category: addModal.activity.category,
          description: addModal.activity.description,
          cost: addModal.activity.cost,
          duration: addModal.activity.duration,
          stopId: selectedStop,
        }),
      });
      if (res.ok) {
        setSuccessMsg(`"${addModal.activity.name}" added to your trip!`);
        setTimeout(() => setSuccessMsg(''), 3000);
        closeAddModal();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAddingTo(null);
    }
  };

  const selectedTripData = trips.find(t => t._id === selectedTrip);
  const stops = selectedTripData?.stops || [];

  const costLabel = (cost) => {
    if (!cost && cost !== 0) return 'Free';
    if (cost === 0) return 'Free';
    if (cost < 20) return '$ (Budget)';
    if (cost < 60) return '$$ (Moderate)';
    return '$$$ (Premium)';
  };

  return (
    <div className="activity-search-container">
      <h1>🎯 Discover Activities</h1>
      <p>Find things to do across the world and add them to your trip</p>

      {successMsg && <div className="activity-success">{successMsg}</div>}

      {/* Filters */}
      <div className="activity-filters">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
          placeholder="Search activities..."
          className="activity-search-input"
        />
        <input
          type="number"
          value={maxCost}
          onChange={e => setMaxCost(e.target.value)}
          placeholder="Max cost ($)"
          className="activity-filter-input"
          min="0"
        />
        <input
          type="number"
          value={maxDuration}
          onChange={e => setMaxDuration(e.target.value)}
          placeholder="Max duration (hrs)"
          className="activity-filter-input"
          min="0"
        />
        <button className="btn btn-primary" onClick={handleSearch}>Search</button>
      </div>

      {/* Category Pills */}
      <div className="category-pills">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`category-pill ${category === cat ? 'active' : ''}`}
            onClick={() => {
              setCategory(cat);
              fetchActivities({ q: query, category: cat, maxCost, maxDuration });
            }}
          >
            {CATEGORY_ICONS[cat]} {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Results */}
      {loading ? (
        <div className="loading">Searching activities...</div>
      ) : activities.length === 0 ? (
        <div className="no-activities">
          <p>No activities found. Try adjusting your filters or search terms.</p>
        </div>
      ) : (
        <div className="activities-grid">
          {activities.map(activity => (
            <div key={activity._id} className="activity-card">
              <div className="activity-card-header">
                <span className="activity-category-badge">
                  {CATEGORY_ICONS[activity.category] || '⭐'} {activity.category}
                </span>
                {activity.cost !== undefined && (
                  <span className="activity-cost-badge">{costLabel(activity.cost)}</span>
                )}
              </div>
              <h3>{activity.name}</h3>
              {activity.description && (
                <p className="activity-description">{activity.description}</p>
              )}
              <div className="activity-meta">
                {activity.duration > 0 && (
                  <span className="meta-item">⏱️ {activity.duration}h</span>
                )}
                {activity.cost >= 0 && (
                  <span className="meta-item">💰 ${activity.cost}</span>
                )}
              </div>
              <button className="btn btn-add" onClick={() => openAddModal(activity)}>
                ➕ Add to Trip
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add to Trip Modal */}
      {addModal && (
        <div className="modal-overlay" onClick={closeAddModal}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <h2>Add to Trip</h2>
            <p className="modal-activity-name">{addModal.activity.name}</p>

            <div className="form-group">
              <label>Select Trip</label>
              <select
                value={selectedTrip}
                onChange={e => { setSelectedTrip(e.target.value); setSelectedStop(''); }}
              >
                <option value="">-- Choose a trip --</option>
                {trips.map(t => (
                  <option key={t._id} value={t._id}>{t.name}</option>
                ))}
              </select>
            </div>

            {selectedTrip && (
              <div className="form-group">
                <label>Select Stop / City</label>
                <select value={selectedStop} onChange={e => setSelectedStop(e.target.value)}>
                  <option value="">-- Choose a stop --</option>
                  {stops.map(s => (
                    <option key={s._id} value={s._id}>{s.city}</option>
                  ))}
                </select>
                {stops.length === 0 && (
                  <p className="hint">This trip has no stops yet. Add stops in the Itinerary Builder first.</p>
                )}
              </div>
            )}

            <div className="modal-actions">
              <button
                className="btn btn-primary"
                onClick={handleAddToTrip}
                disabled={!selectedStop || addingTo}
              >
                {addingTo ? 'Adding...' : 'Add Activity'}
              </button>
              <button className="btn btn-outline" onClick={closeAddModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ActivitySearch;
