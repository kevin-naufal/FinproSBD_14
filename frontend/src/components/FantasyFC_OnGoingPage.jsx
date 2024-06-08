import React from 'react';
import { PageContent } from '../Header'; // Import the PageContent component
import '../style/FantasyFC_OnGoingPage.css';

const FantasyFC_OnGoingPage = () => {
  const players = Array.from({ length: 11 }, (_, index) => ({
    id: index + 1,
    name: `Player ${index + 1}`
  }));

  return (
    <PageContent>
      <div className="ongoing-match-container">
        <h1>Ongoing Matchweek</h1>
        <h3>Club:</h3>
        <div className="players-container">
          {players.map(player => (
            <div key={player.id} className="player-item">
              <label htmlFor={`player-${player.id}`} className="player-label">{player.name}</label>
              <input
                type="text"
                id={`player-${player.id}`}
                value={player.name}
                readOnly
                className="player-input"
              />
            </div>
          ))}
        </div>
      </div>
    </PageContent>
  );
};

export default FantasyFC_OnGoingPage;
