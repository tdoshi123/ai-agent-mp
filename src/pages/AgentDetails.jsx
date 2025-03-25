import { useParams } from 'react-router-dom';
import './AgentDetails.css';

function AgentDetails() {
  const { id } = useParams();

  const agents = {
    1: {
      name: "Data Analysis Assistant",
      emoji: "📊",
      seller: "@tirth",
      description: "Powerful AI assistant for data analysis and visualization",
      price: "4.99",
      tags: ["Data", "Analysis", "Visualization", "Python"],
      uses: 1234,
      rating: 4.8
    },
    2: {
      name: "Content Writer",
      emoji: "✍️",
      seller: "@tirth",
      description: "AI-powered content creation assistant",
      price: "3.99",
      tags: ["Writing", "Content", "SEO", "Marketing"],
      uses: 2341,
      rating: 4.6
    },
    3: {
      name: "Code Assistant",
      emoji: "💻",
      seller: "@tirth",
      description: "Your personal AI coding companion",
      price: "5.99",
      tags: ["Coding", "Development", "Programming"],
      uses: 3456,
      rating: 4.9
    },
    4: {
      name: "Image Generator",
      emoji: "🎨",
      seller: "@tirth",
      description: "Create stunning images with AI",
      price: "6.99",
      tags: ["Art", "Design", "Graphics", "AI"],
      uses: 4567,
      rating: 4.7
    },
    5: {
      name: "Math Tutor",
      emoji: "🔢",
      seller: "@tirth",
      description: "Your personal AI math tutor",
      price: "4.99",
      tags: ["Math", "Education", "Tutoring", "Learning"],
      uses: 5678,
      rating: 4.5
    },
    6: {
      name: "Language Translator",
      emoji: "🌍",
      seller: "@tirth",
      description: "Accurate AI-powered translation assistant",
      price: "3.99",
      tags: ["Translation", "Language", "AI", "Multilingual"],
      uses: 6789,
      rating: 4.3
    },
    7: {
      name: "Music Composer",
      emoji: "🎵",
      seller: "@tirth",
      description: "Create music with AI assistance",
      price: "5.99",
      tags: ["Music", "Composition", "AI", "Sound"],
      uses: 7890,
      rating: 4.2
    },
    8: {
      name: "Video Editor",
      emoji: "🎬",
      seller: "@tirth",
      description: "AI-powered video editing assistant",
      price: "6.99",
      tags: ["Video", "Editing", "AI", "Film"],
      uses: 8901,
      rating: 4.1
    },
    9: {
      name: "Research Assistant",
      emoji: "🔍",
      seller: "@tirth",
      description: "Your AI research companion",
      price: "4.99",
      tags: ["Research", "AI", "Analysis", "Learning"],
      uses: 9012,
      rating: 4.0
    }
  };

  const agent = agents[id];

  if (!agent) {
    return (
      <div className="agent-details">
        <div className="agent-details-container">
          <h2>Agent not found</h2>
        </div>
      </div>
    );
  }

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<span key={i} className="star">★</span>);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<span key={i} className="star half"></span>);  // Remove the content here
      } else {
        stars.push(<span key={i} className="star empty">☆</span>);
      }
    }

    return stars;
  };

  const handleBuy = () => {
    console.log(`Purchasing agent ${id}`);
  };

  return (
    <div className="agent-details">
      <div className="agent-details-container">
        <div className="agent-header">
          <div className="agent-header-left">
            <span className="agent-emoji">{agent.emoji}</span>
            <h2>{agent.name}</h2>
          </div>
          <button className="buy-button" onClick={handleBuy}>
            Buy ${agent.price}
          </button>
        </div>
        <div className="agent-info">
          <p className="seller">Created by <span className="seller-name">{agent.seller}</span></p>
          <div className="tags">
            {agent.tags.map((tag, index) => (
              <span key={index} className="tag">{tag}</span>
            ))}
          </div>
          <p className="description">{agent.description}</p>
          <div className="stats">
            <span className="uses">{agent.uses.toLocaleString()} uses</span>
            <span className="dot">•</span>
            <span className="rating">
              {renderStars(agent.rating)}
              <span className="rating-number">({agent.rating})</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AgentDetails;
