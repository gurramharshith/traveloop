import { useState, useEffect } from 'react';
import './CitySearch.css';

function CitySearch() {
  const [query, setQuery] = useState('');
  const [country, setCountry] = useState('');
  const [region, setRegion] = useState('');
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [trips, setTrips] = useState([]);
  const [addModal, setAddModal] = useState(null); // city being added
  const [selectedTrip, setSelectedTrip] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  useEffect(() => {
    fetchPopular();
    fetchTrips();
  }, []);

  const fetchPopular = async () => {
    try {
      const res = await fetch('/api/cities/popular');
      const data = await res.json();
      setCities(Array.isArray(data) ? data : []);
    } catch (e) { console.error(e); }
  };

  const fetchTrips = async () => {
    try {
      const res = await fetch('/api/trips', { headers });
      const data = await res.json();
      setTrips(Array.isArray(data) ? data : []);
    } catch (e) { console.error(e); }
  };

  const search = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.append('q', query);
      if (country) params.append('country', country);
      if (region) params.append('region', region);
      const res = await fetch(`/api/cities/search?${params.toString()}`);
      const data = await res.json();
      setCities(Array.isArray(data) ? data : []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleAddToTrip = async () => {
    if (!selectedTrip || !addModal) return alert('Select a trip first');
    try {
      // Add as a stop to the selected trip
      const res = await fetch('/api/stops', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          city: addModal.name,
          country: addModal.country,
          tripId: selectedTrip,
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        }),
      });
      if (res.ok) {
        setSuccessMsg(`${addModal.name} added to your trip!`);
        setTimeout(() => setSuccessMsg(''), 3000);
        setAddModal(null);
        setSelectedTrip('');
      }
    } catch (e) { console.error(e); }
  };

  const regions = ['Europe', 'Asia', 'North America', 'South America', 'Oceania', 'Middle East', 'Africa'];

  return (
    <div className="city-search-container">
      <h1>🌍 Explore Cities</h1>
      <p>Discover destinations around the world and add them to your trip</p>

      {successMsg && (
        <div className="city-success">{successMsg}</div>
      )}

      <div className="search-filters">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && search()}
          placeholder="Search city name..."
          className="search-input"
        />
        <input
          type="text"
          value={country}
          onChange={e => setCountry(e.target.value)}
          placeholder="Filter by country"
          className="search-input small"
        />
        <select value={region} onChange={e => setRegion(e.target.value)} className="search-select">
          <option value="">All Regions</option>
          {regions.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        <button className="btn btn-primary" onClick={search}>Search</button>
      </div>

      {loading ? <div className="loading">Searching...</div> : (
        <div className="cities-grid">
          {cities.map(city => (
            <div key={city._id} className="city-card">
              <div className="city-card-header">
                <h3>{city.name}</h3>
                <span className="city-country">{city.country}</span>
              </div>
              {city.description && <p className="city-description">{city.description}</p>}
              <div className="city-meta">
                {city.region && <span className="meta-tag">🌐 {city.region}</span>}
                {city.costIndex && <span className="meta-tag">💰 Cost: {city.costIndex}/10</span>}
                {city.popularity && <span className="meta-tag">⭐ Pop: {city.popularity}/100</span>}
              </div>
              {city.tags && city.tags.length > 0 && (
                <div className="city-tags">
                  {city.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
                </div>
              )}
              <button className="btn btn-add-trip" onClick={() => { setAddModal(city); setSelectedTrip(''); }}>
                ➕ Add to Trip
              </button>
            </div>
          ))}
          {cities.length === 0 && !loading && (
            <div className="no-results">No cities found. Try a different search.</div>
          )}
        </div>
      )}

      {/* Add to Trip Modal */}
      {addModal && (
        <div className="modal-overlay" onClick={() => setAddModal(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <h2>Add {addModal.name} to Trip</h2>
            <p className="modal-city-name">{addModal.country}</p>
            <div className="form-group">
              <label>Select Trip</label>
              <select value={selectedTrip} onChange={e => setSelectedTrip(e.target.value)}>
                <option value="">-- Choose a trip --</option>
                {trips.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
              </select>
              {trips.length === 0 && <p className="hint">No trips yet. Create a trip first.</p>}
            </div>
            <div className="modal-actions">
              <button className="btn btn-primary" onClick={handleAddToTrip} disabled={!selectedTrip}>
                Add as Stop
              </button>
              <button className="btn btn-outline" onClick={() => setAddModal(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CitySearch;
