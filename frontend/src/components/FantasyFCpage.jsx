import React, { useState } from 'react';
import axios from 'axios';
import { PageContent } from '../Header'; // Import the PageContent component

const FantasyFCpage = () => {
  const [searchTerms, setSearchTerms] = useState({
    forwards: ['', '', ''],
    midfielders: ['', '', ''],
    defenders: ['', '', '', ''],
    goalkeeper: ['']
  });

  const [searchResults, setSearchResults] = useState({
    forwards: [[], [], []],
    midfielders: [[], [], []],
    defenders: [[], [], [], []],
    goalkeeper: [[]]
  });

  const handleSearch = async (position, index, term) => {
    if (term.length < 3) {
      setSearchResults(prevResults => ({
        ...prevResults,
        [position]: prevResults[position].map((results, i) => (i === index ? [] : results))
      }));
      return;
    }

    try {
      const response = await axios.get('http://localhost:5000/api/players/search', {
        params: { term }
      });
      const players = response.data;

      setSearchResults(prevResults => ({
        ...prevResults,
        [position]: prevResults[position].map((results, i) => (i === index ? players : results))
      }));
    } catch (error) {
      console.error('Error searching players:', error);
    }
  };

  const handleInputChange = (position, index, value) => {
    setSearchTerms(prevTerms => ({
      ...prevTerms,
      [position]: prevTerms[position].map((term, i) => (i === index ? value : term))
    }));

    handleSearch(position, index, value);
  };

  const handlePlayerSelect = (position, index, player) => {
    const positionMap = {
      forwards: ['Right Winger', 'Left Winger', 'Striker'],
      midfielders: ['Central Midfielder', 'Defensive Midfielder', 'Attacking Midfielder', 'Left Midfielder', 'Right Midfielder'],
      defenders: ['Left Wing-Back', 'Right Wing-Back', 'Left-Back', 'Right-Back', 'Center-Back'],
      goalkeeper: ['Keeper']
    };

    if (positionMap[position].includes(player.position)) {
      setSearchTerms(prevTerms => ({
        ...prevTerms,
        [position]: prevTerms[position].map((term, i) => (i === index ? player.name : term))
      }));

      setSearchResults(prevResults => ({
        ...prevResults,
        [position]: prevResults[position].map((results, i) => (i === index ? [] : results))
      }));
    } else {
      alert(`Selected player does not match the required position for ${position}`);
    }
  };

  return (
    <PageContent> {/* Wrap the content with PageContent */}
      <div style={{ padding: '20px' }}>
        <h1>Player Search</h1>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px'}}>
            {searchTerms.forwards.map((term, index) => (
              <div key={index} style={{ width: '30%' }}>
                <h3>Forward</h3>
                <input
                  type="text"
                  value={term}
                  onChange={(e) => handleInputChange('forwards', index, e.target.value)}
                  placeholder="Search Forward..."
                />
                <ul>
                  {searchResults.forwards[index].map((player) => (
                    <li key={player.id} onClick={() => handlePlayerSelect('forwards', index, player)}>
                      {player.name}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px'}}>
            {searchTerms.midfielders.map((term, index) => (
              <div key={index} style={{ width: '30%' }}>
                <h3>Midfielder</h3>
                <input
                  type="text"
                  value={term}
                  onChange={(e) => handleInputChange('midfielders', index, e.target.value)}
                  placeholder="Search Midfielder..."
                />
                <ul>
                  {searchResults.midfielders[index].map((player) => (
                    <li key={player.id} onClick={() => handlePlayerSelect('midfielders', index, player)}>
                      {player.name}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            {searchTerms.defenders.map((term, index) => (
              <div key={index} style={{ width: '24%' }}>
                <h3>Defender</h3>
                <input
                  type="text"
                  value={term}
                  onChange={(e) => handleInputChange('defenders', index, e.target.value)}
                  placeholder="Search Defender..."
                />
                <ul>
                  {searchResults.defenders[index].map((player) => (
                    <li key={player.id} onClick={() => handlePlayerSelect('defenders', index, player)}>
                      {player.name}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div>
            <h3>Goalkeeper</h3>
            {searchTerms.goalkeeper.map((term, index) => (
              <div key={index}>
                <input
                  type="text"
                  value={term}
                  onChange={(e) => handleInputChange('goalkeeper', index, e.target.value)}
                  placeholder="Search Goalkeeper..."
                />
                <ul>
                  {searchResults.goalkeeper[index].map((player) => (
                    <li key={player.id} onClick={() => handlePlayerSelect('goalkeeper', index, player)}>
                      {player.name}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageContent>
  );
};

export default FantasyFCpage;