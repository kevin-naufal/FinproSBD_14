import React, { useState, useEffect } from 'react';import axios from 'axios';
import { PageContent } from '../Header'; // Import the PageContent component

const FantasyFC_SquadPage = () => {
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
    goalkeeper: [[]],
  });
  
  useEffect(() => {
    fetchMaxMatchweek();
  }, []);

  const [maxMatchweek, setMaxMatchweek] = useState(null);

  const fetchMaxMatchweek = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/matchweeks/max-matchweek');
      setMaxMatchweek(response.data.maxMatchweek);
    } catch (error) {
      console.error('Error fetching maximum matchweek:', error);
    }
  };


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
      {maxMatchweek && (
          <h2 style={{ textAlign: 'center' }}>Matchweek: {maxMatchweek+1}</h2>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px'}}>
            {searchTerms.forwards.map((term, index) => (
              <div key={index} style={{ width: '30%', position: 'relative' }}>
                <h3>Forward</h3>
                <input
                  type="text"
                  value={term}
                  onChange={(e) => handleInputChange('forwards', index, e.target.value)}
                  placeholder="Search Forward..."
                />
                {searchResults.forwards[index].length > 0 && (
                  <ul style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    maxHeight: '150px',
                    overflowY: 'auto',
                    backgroundColor: '#fff',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                    zIndex: 999
                  }}>
                    {searchResults.forwards[index].map((player) => (
                      <li key={player.id} onClick={() => handlePlayerSelect('forwards', index, player)} style={{ cursor: 'pointer', padding: '5px' }}>
                        {player.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px'}}>
            {searchTerms.midfielders.map((term, index) => (
              <div key={index} style={{ width: '30%', position: 'relative' }}>
                <h3>Midfielder</h3>
                <input
                  type="text"
                  value={term}
                  onChange={(e) => handleInputChange('midfielders', index, e.target.value)}
                  placeholder="Search Midfielder..."
                />
                {searchResults.midfielders[index].length > 0 && (
                  <ul style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    maxHeight: '150px',
                    overflowY: 'auto',
                    backgroundColor: '#fff',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                    zIndex: 999
                  }}>
                    {searchResults.midfielders[index].map((player) => (
                      <li key={player.id} onClick={() => handlePlayerSelect('midfielders', index, player)} style={{ cursor: 'pointer', padding: '5px' }}>
                        {player.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            {searchTerms.defenders.map((term, index) => (
              <div key={index} style={{ width: '24%', position: 'relative' }}>
                <h3>Defender</h3>
                <input
                  type="text"
                  value={term}
                  onChange={(e) => handleInputChange('defenders', index, e.target.value)}
                  placeholder="Search Defender..."
                />
                {searchResults.defenders[index].length > 0 && (
                  <ul style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    maxHeight: '150px',
                    overflowY: 'auto',
                    backgroundColor: '#fff',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                    zIndex: 999
                  }}>
                    {searchResults.defenders[index].map((player) => (
                      <li key={player.id} onClick={() => handlePlayerSelect('defenders', index, player)} style={{ cursor: 'pointer', padding: '5px' }}>
                        {player.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
          <div style={{ position: 'relative' }}>
            <h3>Goalkeeper</h3>
            {searchTerms.goalkeeper.map((term, index) => (
              <div key={index}>
                <input
                  type="text"
                  value={term}
                  onChange={(e) => handleInputChange('goalkeeper', index, e.target.value)}
                  placeholder="Search Goalkeeper..."
                />
                {searchResults.goalkeeper[index].length > 0 && (
                  <ul style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    maxHeight: '150px',
                    overflowY: 'auto',
                    backgroundColor: '#fff',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                    zIndex: 999
                  }}>
                    {searchResults.goalkeeper[index].map((player) => (
                      <li key={player.id} onClick={() => handlePlayerSelect('goalkeeper', index, player)} style={{ cursor: 'pointer', padding: '5px' }}>
                        {player.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageContent>
  );
};

export default FantasyFC_SquadPage;