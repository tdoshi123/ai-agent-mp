import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth, database } from '../config/firebase'
import { ref, set, get } from 'firebase/database'
import './Signup.css'

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('');
    
    try {
      const trimmedUsername = formData.username.trim().toLowerCase();
      const trimmedEmail = formData.email.trim().toLowerCase();

      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      // Check username availability
      const usernameRef = ref(database, `usernames/${trimmedUsername}`);
      const usernameSnapshot = await get(usernameRef);
      
      if (usernameSnapshot.exists()) {
        setError('Username already taken');
        return;
      }

      // Create authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        trimmedEmail, 
        formData.password
      );

      const uid = userCredential.user.uid;

      // Create unified user profile
      const userData = {
        email: trimmedEmail,
        username: trimmedUsername,
        createdAt: new Date().toISOString(),
        uid: uid,
        displayName: '', // Will be set in profile setup
        role: '', // Will be set in profile setup
        photoURL: `https://ui-avatars.com/api/?name=${trimmedUsername}&background=random`, // Default avatar
        lastUpdated: new Date().toISOString()
      };

      // Write user data and username index
      await Promise.all([
        set(ref(database, `users/${uid}`), userData),
        set(ref(database, `usernames/${trimmedUsername}`), {
          uid: uid
        })
      ]);

      console.log('User created successfully:', userData);
      navigate('/ai-agent-mp/profile-setup');
      
    } catch (err) {
      console.error('Signup error:', err);
      setError(
        err.code === 'auth/email-already-in-use' ? 'Email already in use' :
        err.code === 'auth/invalid-email' ? 'Invalid email format' :
        err.code === 'auth/weak-password' ? 'Password is too weak' :
        err.message || 'Failed to create account'
      );
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2>Sign Up</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Choose a username"
              pattern="[a-zA-Z0-9_]+"
              title="Username can only contain letters, numbers, and underscores"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              minLength="6"
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm your password"
            />
          </div>
          <button type="submit" className="signup-button">
            Sign Up
          </button>
        </form>
        <p className="login-link">
          Already have an account? <Link to="/ai-agent-mp/login">Login</Link>
        </p>
      </div>
    </div>
  )
}

export default Signup
