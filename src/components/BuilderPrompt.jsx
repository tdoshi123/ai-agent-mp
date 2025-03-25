import { Link } from 'react-router-dom';
import './BuilderPrompt.css';

function BuilderPrompt() {
  return (
    <div className="builder-prompt-overlay">
      <div className="builder-prompt-card">
        <h2>Log in or create an account to start building agents.</h2>
        
        <div className="builder-features">
          <p>With Agent Builder you can:</p>
          <ul>
            <li>Create agents customized to client's requests</li>
            <li>Promote your agents in the marketplace</li>
            <li>Integrate agents with your documents, systems, and tools</li>
          </ul>
        </div>

        <div className="builder-prompt-actions">
          <Link to="/ai-agent-mp/signup" className="signup-button">
            Sign Up
          </Link>
          <Link to="/ai-agent-mp/login" className="login-button">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default BuilderPrompt;