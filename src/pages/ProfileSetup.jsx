import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, database } from '../config/firebase';
import { getDatabase, ref, set, get } from 'firebase/database';
import { useAuth } from '../context/auth/AuthContext';
import './ProfileSetup.css';

function ProfileSetup() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    role: '',
    displayName: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.role || !formData.displayName.trim()) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const userRef = ref(database, `users/${user.uid}`);
      
      // Get current user data
      const snapshot = await get(userRef);
      const currentData = snapshot.val() || {};

      // Update user data
      const updates = {
        ...currentData,
        role: formData.role,
        displayName: formData.displayName.trim(),
        lastUpdated: new Date().toISOString()
      };

      await set(userRef, updates);
      navigate('/ai-agent-mp/');
    } catch (err) {
      console.error('Error saving user data:', err);
      setError('Failed to save profile information. Please try again.');
    }
  };

  return (
    <div className="profile-setup-container">
      <div className="profile-setup-card">
        <h2>Complete Your Profile</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="displayName">Display Name</label>
            <input
              type="text"
              id="displayName"
              name="displayName"
              value={formData.displayName}
              onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
              placeholder="Enter your display name"
              required
            />
          </div>
          <div className="form-group">
            <label>I want to:</label>
            <div className="role-options">
              <button
                type="button"
                className={`role-button ${formData.role === 'user' ? 'active' : ''}`}
                onClick={() => setFormData(prev => ({ ...prev, role: 'user' }))}
              >
                Use AI Agents
              </button>
              <button
                type="button"
                className={`role-button ${formData.role === 'builder' ? 'active' : ''}`}
                onClick={() => setFormData(prev => ({ ...prev, role: 'builder' }))}
              >
                Build AI Agents
              </button>
            </div>
          </div>
          <button type="submit" className="setup-button">
            Complete Setup
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProfileSetup;
