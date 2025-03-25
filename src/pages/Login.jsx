import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth, database } from '../config/firebase'
import { ref, get, query, orderByChild, equalTo } from 'firebase/database'
import './Login.css'

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    usernameOrEmail: '',
    password: ''
  })
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('');
    
    try {
      const trimmedInput = formData.usernameOrEmail.trim().toLowerCase();
      const isEmail = trimmedInput.includes('@');
      
      let email = trimmedInput;
      
      // If it's a username, look up the corresponding email
      if (!isEmail) {
        console.log('Looking up username:', trimmedInput);
        
        try {
          const usernameRef = ref(database, `usernames/${trimmedInput}`);
          const usernameSnapshot = await get(usernameRef);
          
          if (usernameSnapshot.exists()) {
            // Get the uid from username lookup
            const uid = usernameSnapshot.val().uid;
            
            // Get the user data using the uid
            const userRef = ref(database, `users/${uid}`);
            const userSnapshot = await get(userRef);
            
            if (userSnapshot.exists()) {
              email = userSnapshot.val().email;
              console.log('Found email:', email);
            } else {
              setError('User data not found');
              return;
            }
          } else {
            setError('Username not found');
            return;
          }
        } catch (lookupError) {
          console.error('Username lookup error:', lookupError);
          setError('Error looking up username');
          return;
        }
      }
      
      console.log('Attempting login with email:', email);
      
      const userCredential = await signInWithEmailAndPassword(auth, email, formData.password);
      
      if (userCredential.user) {
        navigate('/ai-agent-mp/');
      } else {
        setError('Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(
        err.code === 'auth/wrong-password' ? 'Invalid password' :
        err.code === 'auth/user-not-found' ? 'User not found' :
        err.code === 'auth/invalid-email' ? 'Invalid email format' :
        err.message || 'Login failed. Please try again.'
      );
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prevState => ({
      ...prevState,
      [name]: value.trim() // Add trim to remove any accidental spaces
    }))
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="usernameOrEmail">Username or Email</label>
            <input
              type="text"
              id="usernameOrEmail"
              name="usernameOrEmail"
              value={formData.usernameOrEmail}
              onChange={handleChange}
              required
              placeholder="Enter your username or email"
              autoComplete="username"
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
              autoComplete="current-password"
            />
          </div>
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
        <p className="signup-link">
          Don't have an account? <Link to="/ai-agent-mp/signup">Sign up</Link>
        </p>
      </div>
    </div>
  )
}

export default Login
