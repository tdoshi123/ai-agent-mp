import './Header.css'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTheme } from '../context/theme/ThemeContext'
import { useAuth } from '../context/auth/AuthContext'
import { auth } from '../config/firebase'
import { signOut } from 'firebase/auth'
import { useState, useEffect, useRef } from 'react'
import { useUserRole } from '../hooks/useUserRole';

function Header() {
  const { isDarkMode, toggleTheme } = useTheme();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const { role } = useUserRole();

  // Add this useEffect for debugging
  useEffect(() => {
    if (user) {
      console.log('Current user photo URL:', user.photoURL);
    }
  }, [user]);

  const isActive = (path) => {
    if (path === '/ai-agent-mp/' && location.pathname === '/ai-agent-mp/') {
      return true;
    }
    return location.pathname === path;
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/ai-agent-mp/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

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

  return (
    <header className={`header ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="header-left">
        <img src="/ai-agent-mp/ai-agent-mp-logo.jpeg" alt="AI Agent Marketplace Logo" />
        <h1>AI Agent Marketplace</h1>
      </div>
      <div className="header-right">
        <nav className="header-nav">
          <Link 
            to="/ai-agent-mp/" 
            className={`nav-link ${isActive('/ai-agent-mp/') ? 'active' : ''}`}
          >
            Agents
          </Link>
          {user ? (
            <Link 
              to="/ai-agent-mp/builder" 
              className={`nav-link ${isActive('/ai-agent-mp/builder') ? 'active' : ''}`}
            >
              {role === 'builder' ? 'Requests' : 'Submit Request'}
            </Link>
          ) : (
            <Link 
              to="/ai-agent-mp/builder-info" 
              className={`nav-link ${isActive('/ai-agent-mp/builder-info') ? 'active' : ''}`}
            >
              Builder
            </Link>
          )}
        </nav>
        {user ? (
          <div className="user-menu" ref={dropdownRef}>
            <img
              src={user.photoURL || `https://ui-avatars.com/api/?name=${user.email}&background=random`}
              alt="Profile"
              className="profile-image"
              onClick={() => setShowDropdown(!showDropdown)}
              onError={(e) => {
                e.target.onerror = null; // Prevent infinite loop
                e.target.src = `https://ui-avatars.com/api/?name=${user.email}&background=random`;
              }}
            />
            <div className={`dropdown-menu ${showDropdown ? 'show' : ''}`}>
              <Link to="/ai-agent-mp/profile">My Profile</Link>
              <Link to="/ai-agent-mp/my-agents">My Agents</Link>
              {role === 'builder' ? (
                <Link to="/ai-agent-mp/my-builds">My Builds</Link>
              ) : (
                <Link to="/ai-agent-mp/my-requests">My Requests</Link>
              )}
              <div className="dropdown-divider" />
              <button onClick={toggleTheme}>
                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
              </button>
              <div className="dropdown-divider" />
              <button onClick={handleLogout}>Logout</button>
            </div>
          </div>
        ) : (
          <Link 
            to="/ai-agent-mp/login" 
            className={`nav-link ${isActive('/ai-agent-mp/login') ? 'active' : ''}`}
          >
            Login
          </Link>
        )}
      </div>
    </header>
  )
}

export default Header
