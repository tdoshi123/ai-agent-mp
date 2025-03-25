import React, { useState, useEffect } from 'react';
import { database } from '../firebase';
import { ref, get, query, orderByChild, equalTo } from 'firebase/database';
import { useAuth } from '../contexts/AuthContext';
import './MyRequests.css';

function MyRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const requestsRef = ref(database, 'requests');
        const userRequestsQuery = query(
          requestsRef,
          orderByChild('requesterId'),
          equalTo(user.uid)
        );
        
        const snapshot = await get(userRequestsQuery);
        
        if (snapshot.exists()) {
          const requestsData = Object.entries(snapshot.val()).map(([id, data]) => ({
            id,
            ...data
          }));
          setRequests(requestsData);
        } else {
          setRequests([]);
        }
      } catch (err) {
        console.error('Error fetching requests:', err);
        setError('Failed to load requests');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchRequests();
    }
  }, [user]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="my-requests">
      <h2>My Requests</h2>
      {requests.length === 0 ? (
        <div className="no-requests">You haven't submitted any requests yet.</div>
      ) : (
        <div className="requests-grid">
          {requests.map(request => (
            <div key={request.id} className="request-card">
              <div className="request-header">
                <h3>{request.title}</h3>
                <span className={`status-badge ${request.status}`}>
                  {request.status}
                </span>
              </div>
              <p className="request-description">{request.description}</p>
              <div className="request-footer">
                <div className="request-meta">
                  <span>Budget: ${request.budget}</span>
                  <span>Created: {new Date(request.createdAt).toLocaleDateString()}</span>
                  {request.builderId && (
                    <span>Builder: {request.builderName}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyRequests;