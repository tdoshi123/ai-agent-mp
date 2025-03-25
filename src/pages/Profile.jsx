import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/auth/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { getDatabase, ref, get } from 'firebase/database';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import './Profile.css';

function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const db = getDatabase();
        const userRef = ref(db, `users/${user.uid}`);
        try {
          const snapshot = await get(userRef);
          if (snapshot.exists()) {
            setUserData(snapshot.val());
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, [user]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/ai-agent-mp/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-image-container" ref={dropdownRef}>
            <img
              src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.email}&background=random`}
              alt="Profile"
              className="profile-image"
              onClick={() => setShowDropdown(!showDropdown)}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://ui-avatars.com/api/?name=${user?.email}&background=random`;
              }}
            />
            {showDropdown && (
              <div className="profile-dropdown">
                <Link to="/ai-agent-mp/profile-setup">Edit Profile</Link>
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
          <h2>{userData?.displayName || 'User'}</h2>
          <p>{user?.email}</p>
        </div>
        
        <div className="profile-sections">
          <section className="profile-section">
            <h3>My Content</h3>
            <div className="section-links">
              {userData?.role === 'builder' ? (
                <>
                  <Link to="/ai-agent-mp/my-agents" className="section-link">My Agents</Link>
                  <Link to="/ai-agent-mp/my-builds" className="section-link">My Builds</Link>
                </>
              ) : (
                <>
                  <Link to="/ai-agent-mp/my-agents" className="section-link">My Agents</Link>
                  <Link to="/ai-agent-mp/my-requests" className="section-link">My Requests</Link>
                </>
              )}
            </div>
          </section>
          
          <section className="profile-section">
            <h3>Account Settings</h3>
            <div className="section-links">
              <Link to="/ai-agent-mp/profile-setup" className="section-link">Edit Profile</Link>
              <button onClick={handleLogout} className="logout-button">Logout</button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Profile;
