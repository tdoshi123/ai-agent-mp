import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Agents from './pages/Agents'
import Builder from './pages/Builder'
import Login from './pages/Login'
import Signup from './pages/Signup'
import AgentDetails from './pages/AgentDetails'
import ProfileSetup from './pages/ProfileSetup'
import MyAgents from './pages/MyAgents'
import MyBuilds from './pages/MyBuilds'
import Profile from './pages/Profile'
import MyRequests from './pages/MyRequests'
import { ThemeProvider } from './context/theme/ThemeContext'
import { AuthProvider } from './context/auth/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import BuilderPrompt from './components/BuilderPrompt'

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <div className="app">
            <Header />
            <Routes>
              <Route path="/ai-agent-mp/" element={<Agents />} />
              <Route path="/ai-agent-mp/builder-info" element={<BuilderPrompt />} />
              <Route 
                path="/ai-agent-mp/builder" 
                element={
                  <ProtectedRoute>
                    <Builder />
                  </ProtectedRoute>
                } 
              />
              <Route path="/ai-agent-mp/login" element={<Login />} />
              <Route path="/ai-agent-mp/signup" element={<Signup />} />
              <Route 
                path="/ai-agent-mp/profile-setup" 
                element={
                  <ProtectedRoute>
                    <ProfileSetup />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/ai-agent-mp/my-agents" 
                element={
                  <ProtectedRoute>
                    <MyAgents />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/ai-agent-mp/my-builds" 
                element={
                  <ProtectedRoute>
                    <MyBuilds />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/ai-agent-mp/agent/:id" 
                element={
                  <ProtectedRoute>
                    <AgentDetails />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/ai-agent-mp/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/ai-agent-mp/my-requests" 
                element={
                  <ProtectedRoute>
                    <MyRequests />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </div>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App
