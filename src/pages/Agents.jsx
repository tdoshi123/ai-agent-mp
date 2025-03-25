import './Agents.css'
import { useState } from 'react'
import Cards from '../components/Cards'

function Agents() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="agents">
      <div className="hero">
        <h1>AI Agent Marketplace</h1>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search for AI agents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <Cards searchQuery={searchQuery} />
    </div>
  )
}

export default Agents