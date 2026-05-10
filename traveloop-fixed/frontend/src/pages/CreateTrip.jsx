import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTripStore } from '../stores/tripStore';
import './CreateTrip.css';

function CreateTrip() {
  const navigate = useNavigate();
  const { addTrip } = useTripStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    budget: 0,
    coverPhoto: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/trips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        addTrip(data.trip);
        navigate(`/trip/${data.trip._id}/builder`);
      }
    } catch (error) {
      console.error('Error creating trip:', error);
      alert('Error creating trip');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-trip-container">
      <div className="create-trip-card">
        <h1>Create New Trip ✈️</h1>
        <p>Let's plan your next adventure</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Trip Name *</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Summer Europe Tour"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your trip"
              rows="4"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startDate">Start Date *</label>
              <input
                id="startDate"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="endDate">End Date *</label>
              <input
                id="endDate"
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="budget">Budget (USD)</label>
            <input
              id="budget"
              name="budget"
              type="number"
              value={formData.budget}
              onChange={handleChange}
              placeholder="5000"
            />
          </div>

          <div className="form-group">
            <label htmlFor="coverPhoto">Cover Photo URL</label>
            <input
              id="coverPhoto"
              name="coverPhoto"
              type="url"
              value={formData.coverPhoto}
              onChange={handleChange}
              placeholder="https://..."
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create Trip'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateTrip;
