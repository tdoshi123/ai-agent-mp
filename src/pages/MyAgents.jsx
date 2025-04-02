import { useState, useEffect } from 'react';
import { database } from '../config/firebase';
import { ref, get, query, orderByChild, equalTo } from 'firebase/database';
import { useAuth } from '../context/auth/AuthContext';
import { useUserRole } from '../hooks/useUserRole';
import './MyAgents.css';

function MyAgents() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const { role } = useUserRole();

  useEffect(() => {
    const fetchAgents = async () => {
      if (!user) return;

      try {
        const agentsRef = ref(database, 'agents');
        let agentsQuery;

        if (role === 'builder') {
          // Fetch agents created by this builder
          agentsQuery = query(
            agentsRef,
            orderByChild('creatorId'),
            equalTo(user.uid)
          );
        } else {
          // Fetch agents purchased by this user
          agentsQuery = query(
            agentsRef,
            orderByChild('purchasers'),
            equalTo(user.uid)
          );
        }

        const snapshot = await get(agentsQuery);
        
        if (snapshot.exists()) {
          const agentsData = Object.entries(snapshot.val()).map(([id, data]) => ({
            id,
            ...data
          }));
          setAgents(agentsData);
        } else {
          setAgents([]);
        }
      } catch (err) {
        console.error('Error fetching agents:', err);
        setError('Failed to load agents');
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, [user, role]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="my-agents">
      <h2>{role === 'builder' ? 'My Created Agents' : 'My Purchased Agents'}</h2>
      {agents.length === 0 ? (
        <div className="no-agents">
          {role === 'builder' 
            ? "You haven't created any agents yet."
            : "You haven't purchased any agents yet."}
        </div>
      ) : (
        <div className="agents-grid">
          {agents.map(agent => (
            <div key={agent.id} className="agent-card">
              <div className="agent-header">
                <span className="agent-emoji">{agent.emoji}</span>
                <h3>{agent.name}</h3>
              </div>
              <p className="agent-description">{agent.description}</p>
              <div className="agent-tags">
                {agent.tags && agent.tags.map((tag, index) => (
                  <span key={index} className="tag">{tag}</span>
                ))}
              </div>
              <div className="agent-footer">
                <div className="agent-stats">
                  <span>{agent.uses || 0} uses</span>
                  <span className="dot">•</span>
                  <span className="rating">★ {agent.rating || 0}</span>
                </div>
                {role === 'builder' && (
                  <div className="agent-meta">
                    <span>Price: ${agent.price}</span>
                    <span>Sales: {agent.sales || 0}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyAgents;
