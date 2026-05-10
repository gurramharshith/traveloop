import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './PublicTrip.css';

function PublicTrip() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => { fetchPublicTrip(); }, [id]);

  const fetchPublicTrip = async () => {
    try {
      const response = await fetch(`/api/trips/public/${id}`);
      const data = await response.json();
      setTrip(data);
    } catch (error) {
      console.error('Error fetching public trip:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOnTwitter = () => {
    const text = encodeURIComponent(`Check out my trip: ${trip?.name} ✈️`);
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  const shareOnWhatsApp = () => {
    const text = encodeURIComponent(`Check out my trip: ${trip?.name} ✈️ ${window.location.href}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const shareOnFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  };

  if (loading) return <div className="loading">Loading trip...</div>;
  if (!trip) return (
    <div className="public-error">
      <h2>🔒 Trip Not Found</h2>
      <p>This trip doesn't exist or hasn't been made public.</p>
    </div>
  );

  const totalActivitiesCost = (trip.stops || []).reduce((acc, stop) =>
    acc + (stop.activities || []).reduce((a, act) => a + (act.cost || 0), 0), 0);

  return (
    <div className="public-trip-container">
      <div className="public-trip-header">
        <div className="public-trip-title">
          <h1>{trip.name} ✈️</h1>
          {trip.description && <p>{trip.description}</p>}
          <div className="trip-meta-row">
            <span>📅 {new Date(trip.startDate).toLocaleDateString()} – {new Date(trip.endDate).toLocaleDateString()}</span>
            <span>🏙️ {trip.stops?.length || 0} stops</span>
            {trip.budget > 0 && <span>💰 Budget: ${trip.budget.toLocaleString()}</span>}
          </div>
        </div>

        <div className="share-section">
          <h3>Share this Trip</h3>
          <div className="share-buttons">
            <button className="btn btn-primary" onClick={copyLink}>
              {copied ? '✅ Copied!' : '🔗 Copy Link'}
            </button>
            <button className="btn share-twitter" onClick={shareOnTwitter}>🐦 Twitter</button>
            <button className="btn share-whatsapp" onClick={shareOnWhatsApp}>💬 WhatsApp</button>
            <button className="btn share-facebook" onClick={shareOnFacebook}>📘 Facebook</button>
          </div>
        </div>
      </div>

      {/* Itinerary */}
      <div className="public-itinerary">
        <h2>Itinerary</h2>
        {trip.stops && trip.stops.length > 0 ? (
          <div className="public-stops-list">
            {trip.stops.map((stop, index) => (
              <div key={stop._id} className="public-stop-card">
                <div className="stop-number-badge">{index + 1}</div>
                <div className="public-stop-content">
                  <h3>📍 {stop.city}{stop.country ? `, ${stop.country}` : ''}</h3>
                  <p className="stop-dates">
                    {new Date(stop.startDate).toLocaleDateString()} → {new Date(stop.endDate).toLocaleDateString()}
                  </p>

                  {stop.activities && stop.activities.length > 0 && (
                    <div className="public-activities">
                      <h4>Activities</h4>
                      {stop.activities.map(act => (
                        <div key={act._id} className="public-activity-item">
                          <span className="act-category-badge">{act.category}</span>
                          <span className="act-name">{act.name}</span>
                          {act.time && <span className="act-meta">🕐 {act.time}</span>}
                          {act.cost > 0 && <span className="act-meta">💰 ${act.cost}</span>}
                          {act.duration > 0 && <span className="act-meta">⏱ {act.duration}h</span>}
                          {act.description && <p className="act-description">{act.description}</p>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No stops have been added to this trip.</p>
        )}
      </div>

      {totalActivitiesCost > 0 && (
        <div className="public-budget-summary">
          <h2>Estimated Activity Costs</h2>
          <p className="budget-total">Total: <strong>${totalActivitiesCost.toLocaleString()}</strong></p>
        </div>
      )}

      <div className="public-footer">
        <p>Made with Traveloop ✈️</p>
      </div>
    </div>
  );
}

export default PublicTrip;
