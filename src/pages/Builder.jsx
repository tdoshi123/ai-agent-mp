import { useState, useEffect } from 'react';
import { database } from '../config/firebase';
import { ref, get, update, push } from 'firebase/database';
import { useAuth } from '../context/auth/AuthContext';
import { useUserRole } from '../hooks/useUserRole';
import './Builder.css';

function Builder() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();
  const { role, loading: roleLoading } = useUserRole();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: ''
  });
  // Add this state for tools
  const [tools, setTools] = useState([]);
  const [toolInput, setToolInput] = useState('');

  useEffect(() => {
    console.log('Current user role:', role);
    
    if (role === 'builder') {
      fetchRequests();
    } else {
      setLoading(false);
    }
  }, [role]);

  const fetchRequests = async () => {
    try {
      const requestsRef = ref(database, 'requests');
      const snapshot = await get(requestsRef);
      
      if (snapshot.exists()) {
        const requestsData = Object.entries(snapshot.val())
          .map(([id, data]) => ({
            id,
            ...data
          }))
          .filter(request => request.status === 'open');
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

  const handleAcceptRequest = async (requestId) => {
    try {
      const requestRef = ref(database, `requests/${requestId}`);
      
      await update(requestRef, {
        status: 'in_progress',
        builderId: user.uid,
        builderName: user.displayName,
        acceptedAt: new Date().toISOString()
      });

      setRequests(prevRequests => 
        prevRequests.filter(request => request.id !== requestId)
      );
    } catch (err) {
      console.error('Error accepting request:', err);
      setError('Failed to accept request. Please try again.');
    }
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim() || !formData.description.trim() || !formData.budget) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const requestData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        budget: Number(formData.budget),
        tools: tools, // Add the tools array
        status: 'open',
        requesterName: user.displayName,
        requesterId: user.uid,
        createdAt: new Date().toISOString()
      };
      
      const requestsRef = ref(database, 'requests');
      await push(requestsRef, requestData);

      // Clear form and tools
      setFormData({
        title: '',
        description: '',
        budget: ''
      });
      setTools([]); // Clear tools array after successful submission

      // Show success message
      alert('Request submitted successfully!');
    } catch (err) {
      console.error('Error submitting request:', err);
      setError('Failed to submit request. Please try again.');
    }
  };

  // Add this handler for tools
  const handleToolSubmit = (e) => {
    e.preventDefault();
    if (toolInput.trim()) {
      setTools([...tools, toolInput.trim()]);
      setToolInput('');
    }
  };

  const handleRemoveTool = (indexToRemove) => {
    setTools(tools.filter((_, index) => index !== indexToRemove));
  };

  if (loading || roleLoading) {
    return (
      <div className="builder">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="builder">
        <div className="error">{error}</div>
      </div>
    );
  }

  // Show request form for users
  if (role === 'user' || !role) {
    return (
      <div className="builder">
        <div className="builder-header">
          <h2>Submit AI Agent Request</h2>
        </div>
        <form onSubmit={handleSubmitRequest} className="request-form">
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Enter request title"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Describe what you need..."
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="tools">Tools & Integrations</label>
            <div className="tools-input-container">
              <input
                type="text"
                id="tools"
                value={toolInput}
                onChange={(e) => setToolInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleToolSubmit(e);
                  }
                }}
                placeholder="Type a tool name and press Enter (e.g., OpenAI, WhatsApp)"
              />
            </div>
            <div className="tools-container">
              {tools.map((tool, index) => (
                <span key={index} className="tool-tag">
                  {tool}
                  <button 
                    type="button" 
                    onClick={() => handleRemoveTool(index)}
                    className="remove-tool"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="budget">
              Budget: ${formData.budget}
            </label>
            <input
              type="range"
              id="budget"
              value={formData.budget}
              onChange={(e) => setFormData({...formData, budget: e.target.value})}
              min="1"
              max="1000"
              required
            />
          </div>
          <button type="submit" className="submit-button">Submit Request</button>
        </form>
      </div>
    );
  }

  // Show requests list for builders
  return (
    <div className="builder">
      <div className="builder-header">
        <h2>AI Agent Requests</h2>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search requests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="requests-container">
        {requests.length === 0 ? (
          <div className="no-requests">
            No requests found. Check back later for new opportunities!
          </div>
        ) : (
          requests
            .filter(request =>
              request.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              request.description?.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map(request => (
              <div key={request.id} className="request-card">
                <div className="request-header">
                  <h3>{request.title}</h3>
                  <span className="status-badge">{request.status}</span>
                </div>
                <p className="request-description">{request.description}</p>
                {request.tools && request.tools.length > 0 && (
                  <div className="request-tools">
                    {request.tools.map((tool, index) => (
                      <span key={index} className="tool-tag">{tool}</span>
                    ))}
                  </div>
                )}
                <div className="request-footer">
                  <div className="request-meta">
                    <span>Posted by: {request.requesterName}</span>
                    <span>Budget: ${request.budget}</span>
                  </div>
                  <button 
                    className="accept-button"
                    onClick={() => handleAcceptRequest(request.id)}
                  >
                    Accept Request
                  </button>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
}

export default Builder;
