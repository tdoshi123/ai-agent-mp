{user && (
  <div className="profile-dropdown">
    <Link to="/ai-agent-mp/my-agents">My Agents</Link>
    {role === 'builder' ? (
      <Link to="/ai-agent-mp/my-builds">My Builds</Link>
    ) : (
      <Link to="/ai-agent-mp/my-requests">My Requests</Link>
    )}
  </div>
)}