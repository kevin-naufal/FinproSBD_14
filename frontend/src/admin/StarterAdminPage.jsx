import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function StarterAdminPage() {
  const [fixtures, setFixtures] = useState([]);
  const [selectedFixtureId, setSelectedFixtureId] = useState('');
  const [homeClubId, setHomeClubId] = useState(null);
  const [awayClubId, setAwayClubId] = useState(null);
  const [homePlayers, setHomePlayers] = useState([]);
  const [awayPlayers, setAwayPlayers] = useState([]);
  const [selectedHomePlayers, setSelectedHomePlayers] = useState([]);
  const [selectedAwayPlayers, setSelectedAwayPlayers] = useState([]);
  const [startingHomePlayers, setStartingHomePlayers] = useState([]);
  const [startingAwayPlayers, setStartingAwayPlayers] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [redirectToBench, setRedirectToBench] = useState(false);
  const [startingLineupSubmitted, setStartingLineupSubmitted] = useState(false);
  const [latestFixtureId, setLatestFixtureId] = useState(null);

  useEffect(() => {
    // Fetch fixtures
    axios.get('http://localhost:5000/api/fixtures')
      .then(response => {
        setFixtures(response.data);
      })
      .catch(error => {
        console.error('Error fetching fixtures:', error);
      });
  }, []);

  useEffect(() => {
    // Fetch fixture details and players when a fixture is selected
    if (selectedFixtureId) {
      axios.get(`http://localhost:5000/api/fixtures/${selectedFixtureId}`)
        .then(response => {
          const fixture = response.data;
          setHomeClubId(fixture.home_club_id);
          setAwayClubId(fixture.away_club_id);
        })
        .catch(error => {
          console.error('Error fetching fixture:', error);
        });
    }
  }, [selectedFixtureId]);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setLoading(true);
        const homeRes = await axios.get(`http://localhost:5000/api/players/club/${homeClubId}`);
        const awayRes = await axios.get(`http://localhost:5000/api/players/club/${awayClubId}`);
        if (Array.isArray(homeRes.data)) {
          setHomePlayers(homeRes.data);
        } else {
          setHomePlayers([]);
          setError('Invalid data format received');
        }
        if (Array.isArray(awayRes.data)) {
          setAwayPlayers(awayRes.data);
        } else {
          setAwayPlayers([]);
          setError('Invalid data format received');
        }

        // Fetch listed players for the selected fixture
        const listedRes = await axios.get(`http://localhost:5000/api/players/listed_players/starter/${selectedFixtureId}`);
        const listedPlayers = listedRes.data;

        const startingHome = listedPlayers
          .filter(player => player.club_id === homeClubId)
          .map(player => player.player_id);

        const startingAway = listedPlayers
          .filter(player => player.club_id === awayClubId)
          .map(player => player.player_id);

        setStartingHomePlayers(startingHome);
        setStartingAwayPlayers(startingAway);
        setSelectedHomePlayers(startingHome);
        setSelectedAwayPlayers(startingAway);
        
      } catch (err) {
        console.error(err);
        setError('Failed to fetch players');
      } finally {
        setLoading(false);
      }
    };
    if (homeClubId && awayClubId && selectedFixtureId) fetchPlayers();
  }, [homeClubId, awayClubId, selectedFixtureId]);

  useEffect(() => {
    const fetchLatestFixtureId = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/fixtures/latest');
        setLatestFixtureId(res.data.id);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch the latest fixture ID');
      }
    };
    fetchLatestFixtureId();
  }, []);

  const handleFixtureChange = (event) => {
    setSelectedFixtureId(event.target.value);
  };

  const handleHomeChange = (e, playerId) => {
    if (e.target.checked) {
      setSelectedHomePlayers([...selectedHomePlayers, playerId]);
    } else {
      setSelectedHomePlayers(selectedHomePlayers.filter((id) => id !== playerId));
    }
  };

  const handleAwayChange = (e, playerId) => {
    if (e.target.checked) {
      setSelectedAwayPlayers([...selectedAwayPlayers, playerId]);
    } else {
      setSelectedAwayPlayers(selectedAwayPlayers.filter((id) => id !== playerId));
    }
  };

  const addToStartingLineup = async (homeClubId, awayClubId, homePlayerIds, awayPlayerIds) => {
    try {
      if (homePlayerIds.length < 11) {
        setError('Not enough home players selected for the starting lineup');
        setMessage('');
        return;
      }
    
      if (awayPlayerIds.length < 11) {
        setError('Not enough away players selected for the starting lineup');
        setMessage('');
        return;
      }
    
      // First, perform the DELETE request
      await axios.delete(`http://localhost:5000/api/players/listed_players/starter/${selectedFixtureId}`);
      console.log('DELETE request successful');
    
      // Then, perform the POST request to add players to the starting lineup
      await Promise.all([
        Promise.all(homePlayerIds.map(async (playerId) => {
          await axios.post('http://localhost:5000/api/players/listed_players', { club_id: homeClubId, player_id: playerId, fixture_id: selectedFixtureId });
          console.log(`POST request for home player ${playerId} successful`);
        })),
        Promise.all(awayPlayerIds.map(async (playerId) => {
          await axios.post('http://localhost:5000/api/players/listed_players', { club_id: awayClubId, player_id: playerId, fixture_id: selectedFixtureId });
          console.log(`POST request for away player ${playerId} successful`);
        }))
      ]);
    
      setMessage('Players added to starting lineup successfully!');
      setError('');
      setStartingLineupSubmitted(true);
    } catch (err) {
      console.error(err);
      setError('Failed to add players to starting lineup');
      setMessage('');
    }
  };
  
  

  useEffect(() => {
    if (startingLineupSubmitted) {
      setRedirectToBench(true);
    }
  }, [startingLineupSubmitted]);

  const groupedHomePlayers = homePlayers.reduce((acc, player) => {
    if (!acc[player.position]) {
      acc[player.position] = [];
    }
    acc[player.position].push(player);
    return acc;
  }, {});

  const groupedAwayPlayers = awayPlayers.reduce((acc, player) => {
    if (!acc[player.position]) {
      acc[player.position] = [];
    }
    acc[player.position].push(player);
    return acc;
  }, {});

  return (
    <div>
      <h1>Squad Management</h1>
      <select id="fixture-dropdown" name="fixture-dropdown" onChange={handleFixtureChange}>
        <option value="">Select Fixture</option>
        {fixtures.map(fixture => (
          <option key={fixture.id} value={fixture.id}>
            Fixture {fixture.id}
          </option>
        ))}
      </select>

      {error && <div style={{ color: 'red' }}>{error}</div>}
      {loading ? (
        <p>Loading players...</p>
      ) : (
        <form>
          <div>
            <h2>Home Club</h2>
            {Object.entries(groupedHomePlayers).map(([position, positionPlayers]) => (
              <div key={position}>
                <h3>{position}</h3>
                {positionPlayers.map((player) => (
                  <div key={player.id}>
                    <label htmlFor={`home-player-${player.id}`}>
                      <input
                        type="checkbox"
                        id={`home-player-${player.id}`}
                        name={`home-player-${player.id}`}
                        value={player.id}
                        checked={selectedHomePlayers.includes(player.id)}
                        onChange={(e) => handleHomeChange(e, player.id)}
                      />
                      <span>
                        {player.name}
                      </span>
                    </label>
                  </div>
                ))}
                <br />
              </div>
            ))}
          </div>
          <div>
            <h2>Away Club</h2>
            {Object.entries(groupedAwayPlayers).map(([position, positionPlayers]) => (
              <div key={position}>
                <h3>{position}</h3>
                {positionPlayers.map((player) => (
                  <div key={player.id}>
                    <label htmlFor={`away-player-${player.id}`}>
                      <input
                        type="checkbox"
                        id={`away-player-${player.id}`}
                        name={`away-player-${player.id}`}
                        value={player.id}
                        checked={selectedAwayPlayers.includes(player.id)}
                        onChange={(e) => handleAwayChange(e, player.id)}
                      />
                      <span>
                        {player.name}
                      </span>
                    </label>
                  </div>
                ))}
                <br />
              </div>
            ))}
          </div>
          <button type="button" onClick={() => addToStartingLineup(homeClubId, awayClubId, selectedHomePlayers, selectedAwayPlayers)}>Add to Starting Lineup</button>
        </form>
      )}
      {redirectToBench && (
        <Link
          to={`/admin/bench/${selectedFixtureId}`}
          state={{ homeClubId, awayClubId }}
        >
          Redirect to Bench
        </Link>
      )}

      {message && <div style={{ color: 'green' }}>{message}</div>}
    </div>
  );
}

export default StarterAdminPage;
