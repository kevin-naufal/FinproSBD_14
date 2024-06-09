import React, { useState, useEffect } from 'react';
import axios from 'axios';
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

  const [selectedPlayers, setSelectedPlayers] = useState({
    forwards: [null, null, null],
    midfielders: [null, null, null],
    defenders: [null, null, null, null],
    goalkeeper: [null]
  });

  const [playersData, setPlayersData] = useState({
    forwards: [],
    midfielders: [],
    defenders: [],
    goalkeeper: [],
  });

  useEffect(() => {
    fetchPlayersData();
  }, []);

  const fetchPlayersData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/fantasyfc');
      const players = response.data;

      const positionGroups = {
        forwards: ['Right Winger', 'Left Winger', 'Striker'],
        midfielders: ['Central Midfielder', 'Defensive Midfielder', 'Attacking Midfielder', 'Left Midfielder', 'Right Midfielder'],
        defenders: ['Left Wing-Back', 'Right Wing-Back', 'Left-Back', 'Right-Back', 'Center-Back'],
        goalkeeper: ['Keeper'],
      };

      const groupedPlayers = {
        forwards: [],
        midfielders: [],
        defenders: [],
        goalkeeper: [],
      };

      players.forEach(player => {
        if (positionGroups.forwards.includes(player.player_position)) {
          groupedPlayers.forwards.push(player);
        } else if (positionGroups.midfielders.includes(player.player_position)) {
          groupedPlayers.midfielders.push(player);
        } else if (positionGroups.defenders.includes(player.player_position)) {
          groupedPlayers.defenders.push(player);
        } else if (positionGroups.goalkeeper.includes(player.player_position)) {
          groupedPlayers.goalkeeper.push(player);
        }
      });

      console.log(groupedPlayers);

      setPlayersData(groupedPlayers);
      populateExistingPlayers(groupedPlayers);
    } catch (error) {
      console.error('Error fetching players data:', error);
    }
  };

  const populateExistingPlayers = (groupedPlayers) => {
    const updatedSearchTerms = { ...searchTerms };
    const updatedSelectedPlayers = { ...selectedPlayers };

    Object.keys(groupedPlayers).forEach(position => {
      groupedPlayers[position].forEach((player, index) => {
        if (index < updatedSelectedPlayers[position].length) {
          updatedSelectedPlayers[position][index] = { name: player.player_name, position: player.player_position, id: player.player_id };
          updatedSearchTerms[position][index] = player.player_name;
        }
      });
    });

    setSearchTerms(updatedSearchTerms);
    setSelectedPlayers(updatedSelectedPlayers);
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
    console.log(`Selected player: ${player.name} (Position: ${player.position}) (id: ${player.id})`);

    const positionMap = {
      forwards: ['Right Winger', 'Left Winger', 'Striker'],
      midfielders: ['Central Midfielder', 'Defensive Midfielder', 'Attacking Midfielder', 'Left Midfielder', 'Right Midfielder'],
      defenders: ['Left Wing-Back', 'Right Wing-Back', 'Left-Back', 'Right-Back', 'Center-Back'],
      goalkeeper: ['Keeper']
    };

    if (positionMap[position].includes(player.position)) {
      setSelectedPlayers(prevPlayers => ({
        ...prevPlayers,
        [position]: prevPlayers[position].map((p, i) => (i === index ? player : p))
      }));

      setSearchResults(prevResults => ({
        ...prevResults,
        [position]: prevResults[position].map((results, i) => (i === index ? [] : results))
      }));

      setSearchTerms(prevTerms => ({
        ...prevTerms,
        [position]: prevTerms[position].map((term, i) => (i === index ? player.name : term))
      }));
    } else {
      alert(`Selected player does not match the required position for ${position}`);
    }
  };

  const handleSubmit = async () => {
    try {
      // Fetch the latest login session to obtain the user_id
      const latestLoginSessionResponse = await axios.get('http://localhost:5000/api/login/latest-login-session');
      const user_id = latestLoginSessionResponse.data[0].user_id;

      Object.entries(selectedPlayers).forEach(async ([position, players]) => {
        for (const player of players) {
          if (player) { // Check if player is selected
            try {
              const response = await axios.post('http://localhost:5000/api/fantasyfc', {
                user_id: user_id,
                player_id: player.id
              });
              console.log('FantasyFC entry added:', response.data);
            } catch (error) {
              console.error('Error adding FantasyFC entry:', error);
              alert('Failed to submit FantasyFC squad. Please try again later.');
            }
          }
        }
      });

      alert('FantasyFC squad submitted successfully!');
    } catch (error) {
      console.error('Error adding FantasyFC entry:', error);
      alert('Failed to submit FantasyFC squad. Please try again later.');
    }
  };

  return (
    <PageContent> {/* Wrap the content with PageContent */}
      <div style={{ padding: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
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
                    borderRadius: '10px',
                    zIndex: 999,
                  }}>
                    {searchResults.forwards[index].map((player, playerIndex) => (
  <li key={`${player.player_id}-${playerIndex}`} onClick={() => handlePlayerSelect('forwards', index, player)} style={{ cursor: 'pointer', padding: '20px', color: '#000' }}>
    {player.player_name}
  </li>
))}


                  </ul>
                )}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
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
                    zIndex: 999,
                  }}>
                    {searchResults.midfielders[index].map((player) => (
                      <li key={player.player_id} onClick={() => handlePlayerSelect('midfielders', index, player)} style={{ cursor: 'pointer', padding: '5px' }}>
                        {player.player_name}
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
                    zIndex: 999,
                  }}>
                    {searchResults.defenders[index].map((player) => (
                      <li key={player.player_id} onClick={() => handlePlayerSelect('defenders', index, player)} style={{ cursor: 'pointer', padding: '5px' }}>
                        {player.player_name}
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
                    zIndex: 999,
                  }}>
                    {searchResults.goalkeeper[index].map((player) => (
                      <li key={player.player_id} onClick={() => handlePlayerSelect('goalkeeper', index, player)} style={{ cursor: 'pointer', padding: '5px' }}>
                        {player.player_name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
            <button onClick={handleSubmit} style={{ width: '100%', padding: '10px', marginTop: '10px', fontSize: '18px', backgroundColor: '#007bff', color: '#fff', borderRadius: '5px', border: 'none', cursor: 'pointer' }}>Submit</button>
          </div>
        </div>
      </div>
    </PageContent>
  );
};

export default FantasyFC_SquadPage;