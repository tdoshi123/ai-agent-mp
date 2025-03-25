import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/auth/AuthContext';

function ProtectedRoute({ children }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/ai-agent-mp/login" />;
  }

  return children;
}

export default ProtectedRoute;