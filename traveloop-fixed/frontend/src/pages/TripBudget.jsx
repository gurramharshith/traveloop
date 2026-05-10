import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './TripBudget.css';

function TripBudget() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => { fetchTrip(); }, [id]);

  const fetchTrip = async () => {
    try {
      const res = await fetch(`/api/trips/${id}`, { headers });
      const data = await res.json();
      setTrip(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  if (loading) return <div className="loading">Loading budget...</div>;
  if (!trip) return <div className="error">Trip not found</div>;

  const stops = trip.stops || [];
  const totalActivitiesCost = stops.reduce((acc, stop) => {
    return acc + (stop.activities || []).reduce((a, act) => a + (act.cost || 0), 0);
  }, 0);
  const totalAccommodationCost = stops.reduce((acc, stop) => acc + (stop.accommodation?.cost || 0), 0);
  const totalEstimated = totalActivitiesCost + totalAccommodationCost;
  const totalBudget = trip.budget || 0;
  const remaining = totalBudget - totalEstimated;
  const usagePercent = totalBudget > 0 ? Math.min((totalEstimated / totalBudget) * 100, 100) : 0;

  const tripDays = trip.startDate && trip.endDate
    ? Math.ceil((new Date(trip.endDate) - new Date(trip.startDate)) / (1000 * 60 * 60 * 24)) || 1
    : 1;
  const avgPerDay = totalEstimated / tripDays;

  const categoryBreakdown = {};
  stops.forEach(stop => {
    (stop.activities || []).forEach(act => {
      const cat = act.category || 'other';
      categoryBreakdown[cat] = (categoryBreakdown[cat] || 0) + (act.cost || 0);
    });
  });

  const categoryColors = {
    sightseeing: '#6366f1', food: '#f59e0b', adventure: '#10b981',
    culture: '#8b5cf6', relaxation: '#06b6d4', shopping: '#ec4899',
    nightlife: '#f43f5e', other: '#94a3b8',
  };

  const pieTotal = Object.values(categoryBreakdown).reduce((a, b) => a + b, 0);
  let startAngle = -90;
  const slices = Object.entries(categoryBreakdown).map(([cat, val]) => {
    const pct = pieTotal > 0 ? val / pieTotal : 0;
    const angle = pct * 360;
    const slice = { cat, val, pct, startAngle, endAngle: startAngle + angle, color: categoryColors[cat] || '#94a3b8' };
    startAngle += angle;
    return slice;
  });

  const polarToCartesian = (cx, cy, r, deg) => {
    const rad = (deg - 90) * Math.PI / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };

  const describeArc = (cx, cy, r, startDeg, endDeg) => {
    const start = polarToCartesian(cx, cy, r, endDeg);
    const end = polarToCartesian(cx, cy, r, startDeg);
    const large = endDeg - startDeg > 180 ? 1 : 0;
    return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${large} 0 ${end.x} ${end.y} Z`;
  };

  return (
    <div className="budget-container">
      <div className="budget-header">
        <div>
          <h1>💰 Trip Budget</h1>
          <p>{trip.name}</p>
        </div>
        <Link to={`/trip/${id}`} className="btn btn-outline">← Back to Trip</Link>
      </div>

      {/* Budget Overview */}
      <div className="budget-overview">
        <div className="budget-card total-budget">
          <div className="budget-label">Total Budget</div>
          <div className="budget-amount">${totalBudget.toLocaleString()}</div>
        </div>
        <div className="budget-card spent">
          <div className="budget-label">Estimated Cost</div>
          <div className="budget-amount">${totalEstimated.toLocaleString()}</div>
        </div>
        <div className={`budget-card ${remaining >= 0 ? 'remaining' : 'over-budget'}`}>
          <div className="budget-label">{remaining >= 0 ? 'Remaining' : 'Over Budget'}</div>
          <div className="budget-amount">${Math.abs(remaining).toLocaleString()}</div>
        </div>
        <div className="budget-card daily">
          <div className="budget-label">Avg / Day</div>
          <div className="budget-amount">${avgPerDay.toFixed(0)}</div>
        </div>
      </div>

      {/* Progress Bar */}
      {totalBudget > 0 && (
        <div className="budget-progress-section">
          <div className="budget-progress-label">
            <span>Budget Usage</span>
            <span>{usagePercent.toFixed(1)}%</span>
          </div>
          <div className="budget-progress-bar">
            <div
              className={`budget-progress-fill ${usagePercent > 100 ? 'over' : usagePercent > 80 ? 'warning' : ''}`}
              style={{ width: `${usagePercent}%` }}
            />
          </div>
          {remaining < 0 && <div className="over-budget-alert">⚠️ You're ${Math.abs(remaining).toLocaleString()} over budget!</div>}
        </div>
      )}

      <div className="budget-grid">
        {/* Cost Breakdown by Type */}
        <div className="budget-section">
          <h2>Cost Breakdown</h2>
          <div className="breakdown-items">
            <div className="breakdown-item">
              <span className="breakdown-label">🏨 Accommodation</span>
              <span className="breakdown-value">${totalAccommodationCost.toLocaleString()}</span>
            </div>
            <div className="breakdown-item">
              <span className="breakdown-label">🎯 Activities</span>
              <span className="breakdown-value">${totalActivitiesCost.toLocaleString()}</span>
            </div>
            <div className="breakdown-item total-row">
              <span className="breakdown-label">Total Estimated</span>
              <span className="breakdown-value">${totalEstimated.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Activities by Category */}
        {pieTotal > 0 && (
          <div className="budget-section">
            <h2>Activities by Category</h2>
            <div className="pie-chart-container">
              <svg viewBox="0 0 200 200" width="160" height="160">
                {slices.map(slice => (
                  <path
                    key={slice.cat}
                    d={describeArc(100, 100, 90, slice.startAngle, slice.endAngle)}
                    fill={slice.color}
                    stroke="white"
                    strokeWidth="2"
                  />
                ))}
              </svg>
              <div className="pie-legend">
                {slices.map(slice => (
                  <div key={slice.cat} className="legend-item">
                    <span className="legend-dot" style={{ background: slice.color }} />
                    <span>{slice.cat}: ${slice.val.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Per-Stop Breakdown */}
      {stops.length > 0 && (
        <div className="budget-section">
          <h2>Cost by Stop</h2>
          <div className="stop-budget-list">
            {stops.map(stop => {
              const actCost = (stop.activities || []).reduce((a, act) => a + (act.cost || 0), 0);
              const accCost = stop.accommodation?.cost || 0;
              const stopTotal = actCost + accCost;
              return (
                <div key={stop._id} className="stop-budget-item">
                  <div className="stop-budget-header">
                    <strong>📍 {stop.city}</strong>
                    <span className="stop-budget-total">${stopTotal.toLocaleString()}</span>
                  </div>
                  <div className="stop-budget-details">
                    <span>Activities: ${actCost.toLocaleString()}</span>
                    {accCost > 0 && <span>Accommodation: ${accCost.toLocaleString()}</span>}
                  </div>
                  {stop.activities?.map(act => (
                    <div key={act._id} className="activity-budget-row">
                      <span>• {act.name}</span>
                      <span>${act.cost || 0}</span>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default TripBudget;
