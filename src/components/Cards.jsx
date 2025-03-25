import './Cards.css'
import { useNavigate } from 'react-router-dom'

function Cards({ searchQuery }) {
  const navigate = useNavigate();
  
  // Temporary mock data for AI agents
  const agents = [
    {
      id: 1,
      name: "Data Analysis Assistant",
      emoji: "📊"
    },
    {
      id: 2,
      name: "Content Writer",
      emoji: "✍️"
    },
    {
      id: 3,
      name: "Code Assistant",
      emoji: "💻"
    },
    {
      id: 4,
      name: "Image Generator",
      emoji: "🎨"
    },
    {
      id: 5,
      name: "Math Tutor",
      emoji: "🔢"
    },
    {
      id: 6,
      name: "Language Translator",
      emoji: "🌍"
    },
    {
      id: 7,
      name: "Music Composer",
      emoji: "🎵"
    },
    {
      id: 8,
      name: "Video Editor",
      emoji: "🎬"
    },
    {
      id: 9,
      name: "Research Assistant",
      emoji: "🔍"
    }
  ]

  // Filter agents based on search query
  const filteredAgents = agents.filter(agent =>
    agent.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAddClick = (agentId, e) => {
    e.stopPropagation(); // Prevent card click event from triggering
    navigate(`/ai-agent-mp/agent/${agentId}`);
  };

  return (
    <div className="cards-container">
      {filteredAgents.map(agent => (
        <div key={agent.id} className="card">
          <div className="card-content">
            <span className="agent-emoji">{agent.emoji}</span>
            <h3>{agent.name}</h3>
            <button 
              className="add-button"
              onClick={(e) => handleAddClick(agent.id, e)}
              aria-label={`Add ${agent.name}`}
            >
              +
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Cards
