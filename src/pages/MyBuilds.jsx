import { useState, useEffect } from 'react';
import { database } from '../config/firebase';
import { ref, get, query, orderByChild, equalTo } from 'firebase/database';
import { useAuth } from '../context/auth/AuthContext';
import './MyBuilds.css';

function MyBuilds() {
  const [builds, setBuilds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const formatStatus = (status) => {
    return status.split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  useEffect(() => {
    const fetchBuilds = async () => {
      try {
        const requestsRef = ref(database, 'requests');
        const builderRequestsQuery = query(
          requestsRef,
          orderByChild('builderId'),
          equalTo(user.uid)
        );
        
        const snapshot = await get(builderRequestsQuery);
        
        if (snapshot.exists()) {
          const buildsData = Object.entries(snapshot.val())
            .map(([id, data]) => ({
              id,
              ...data
            }))
            .filter(build => build.status === 'in_progress');
          setBuilds(buildsData);
        } else {
          setBuilds([]);
        }
      } catch (err) {
        console.error('Error fetching builds:', err);
        setError('Failed to load builds');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchBuilds();
    }
  }, [user]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="my-builds">
      <h2>My Builds</h2>
      {builds.length === 0 ? (
        <div className="no-builds">You haven't accepted any requests yet.</div>
      ) : (
        <div className="builds-grid">
          {builds.map(build => (
            <div key={build.id} className="build-card">
              <div className="build-header">
                <h3>{build.title}</h3>
                <span className={`status-badge ${build.status}`}>
                  {formatStatus(build.status)}
                </span>
              </div>
              <p className="build-description">{build.description}</p>
              {build.tools && build.tools.length > 0 && (
                <div className="build-tools">
                  <h4>Required Tools:</h4>
                  <div className="tools-container">
                    {build.tools.map((tool, index) => (
                      <span key={index} className="tool-tag">{tool}</span>
                    ))}
                  </div>
                </div>
              )}
              <div className="build-footer">
                <div className="build-meta">
                  <span>Requester: {build.requesterName}</span>
                  <span>Budget: ${build.budget}</span>
                  <span>Accepted: {new Date(build.acceptedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyBuilds;
