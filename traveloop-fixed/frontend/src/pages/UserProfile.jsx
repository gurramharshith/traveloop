import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import './UserProfile.css';

function UserProfile() {
  const { user, logout, setUser } = useAuthStore();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    profilePicture: user?.profilePicture || '',
    language: user?.language || 'en',
  });
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');
    try {
      const res = await fetch('/api/users/profile', {
        method: 'PUT', headers,
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        if (setUser) setUser(data.user);
        setSuccessMsg('Profile updated successfully!');
        setIsEditing(false);
      } else {
        setErrorMsg(data.message || 'Failed to update profile');
      }
    } catch (e) {
      setErrorMsg('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to permanently delete your account? This action cannot be undone.')) return;
    try {
      const res = await fetch('/api/users/account', { method: 'DELETE', headers });
      if (res.ok) {
        logout();
        navigate('/');
      }
    } catch (e) {
      alert('Failed to delete account');
    }
  };

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Spanish' },
    { code: 'fr', label: 'French' },
    { code: 'de', label: 'German' },
    { code: 'ja', label: 'Japanese' },
    { code: 'zh', label: 'Chinese' },
    { code: 'hi', label: 'Hindi' },
  ];

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h1>My Profile</h1>

        {successMsg && <div className="success-message">{successMsg}</div>}
        {errorMsg && <div className="error-message">{errorMsg}</div>}

        <div className="profile-section">
          <h2>Personal Information</h2>
          {isEditing ? (
            <>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input id="name" name="name" type="text" value={formData.name} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={user?.email} disabled className="input-disabled" />
                <small>Email cannot be changed</small>
              </div>
              <div className="form-group">
                <label htmlFor="profilePicture">Profile Picture URL</label>
                <input id="profilePicture" name="profilePicture" type="url" value={formData.profilePicture} onChange={handleChange} placeholder="https://..." />
              </div>
              <div className="form-group">
                <label htmlFor="language">Language Preference</label>
                <select id="language" name="language" value={formData.language} onChange={handleChange}>
                  {languages.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
                </select>
              </div>
              <div className="profile-actions">
                <button onClick={handleSave} className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button onClick={() => setIsEditing(false)} className="btn btn-outline">Cancel</button>
              </div>
            </>
          ) : (
            <>
              <div className="profile-avatar">
                {user?.profilePicture ? (
                  <img src={user.profilePicture} alt="Profile" className="avatar-img" />
                ) : (
                  <div className="avatar-placeholder">{user?.name?.[0]?.toUpperCase()}</div>
                )}
              </div>
              <div className="profile-info">
                <div className="info-row"><label>Name</label><p>{user?.name}</p></div>
                <div className="info-row"><label>Email</label><p>{user?.email}</p></div>
                <div className="info-row"><label>Language</label><p>{languages.find(l => l.code === (user?.language || 'en'))?.label || 'English'}</p></div>
              </div>
              <button onClick={() => setIsEditing(true)} className="btn btn-secondary">Edit Profile</button>
            </>
          )}
        </div>

        <div className="profile-section">
          <h2>Privacy & Settings</h2>
          <p className="settings-info">Manage your account preferences and privacy settings.</p>
        </div>

        <div className="profile-section danger-zone">
          <h2>Danger Zone</h2>
          <p>Once you delete your account, there is no going back. All trips and data will be permanently removed.</p>
          <button onClick={handleDeleteAccount} className="btn btn-danger">Delete Account</button>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
