import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, Navigate } from 'react-router-dom';

function StarterAdminPage() {
  const location = useLocation();
  const { home_club_id, away_club_id } = location.state || {};
  const [homePlayers, setHomePlayers] = useState([]);
  const [awayPlayers, setAwayPlayers] = useState([]);
  const [selectedHomePlayers, setSelectedHomePlayers] = useState([]);
  const [selectedAwayPlayers, setSelectedAwayPlayers] = useState([]);
  const [startingHomePlayers, setStartingHomePlayers] = useState([]);
  const [startingAwayPlayers, setStartingAwayPlayers] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [redirectToBench, setRedirectToBench] = useState(false); // Changed state variable name
  const [startingLineupSubmitted, setStartingLineupSubmitted] = useState(false);
  const [latestFixtureId, setLatestFixtureId] = useState(null);

  // Fetch players for the selected home club
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setLoading(true);
        const homeRes = await axios.get(`http://localhost:5000/api/players/club/${home_club_id}`);
        const awayRes = await axios.get(`http://localhost:5000/api/players/club/${away_club_id}`);
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
      } catch (err) {
        console.error(err);
        setError('Failed to fetch players');
      } finally {
        setLoading(false);
      }
    };
    if (home_club_id && away_club_id) fetchPlayers();
  }, [home_club_id, away_club_id]);

  // Fetch the latest fixture ID and players for starting lineup
  useEffect(() => {
    const fetchLatestFixtureId = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/fixtures/latest');
        setLatestFixtureId(res.data.id);

        // Fetch current starting lineup for the latest fixture
        const startingRes = await axios.get(`http://localhost:5000/api/starter/fixture/${res.data.id}`);

        setStartingHomePlayers(startingRes.data.filter(player => player.club_id === home_club_id).map(player => player.player_id));
        setStartingAwayPlayers(startingRes.data.filter(player => player.club_id === away_club_id).map(player => player.player_id));
      } catch (err) {
        console.error(err);
        setError('Failed to fetch the latest fixture ID');
      }
    };
    fetchLatestFixtureId();
  }, [home_club_id, away_club_id]);

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
      // Check if enough players selected
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
  
      // Add players to starting lineup
      await Promise.all([
        Promise.all(homePlayerIds.map(async (playerId) => {
          const postData = { club_id: homeClubId, player_id: playerId, fixture_id: latestFixtureId };
          await axios.post('http://localhost:5000/api/starter', postData);
          await axios.post('http://localhost:5000/api/players/listed_players', { club_id: homeClubId, player_id: playerId, fixture_id: latestFixtureId });
        })),
        Promise.all(awayPlayerIds.map(async (playerId) => {
          const postData = { club_id: awayClubId, player_id: playerId, fixture_id: latestFixtureId };
          await axios.post('http://localhost:5000/api/starter', postData);
          await axios.post('http://localhost:5000/api/players/listed_players', { club_id: awayClubId, player_id: playerId, fixture_id: latestFixtureId });
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
      // Redirect to the BenchAdminPage with club IDs passed as state
      setRedirectToBench(true);
    }
  }, [startingLineupSubmitted]);

  // Group home players by position
  const groupedHomePlayers = homePlayers.reduce((acc, player) => {
    if (!acc[player.position]) {
      acc[player.position] = [];
    }
    acc[player.position].push(player);
    return acc;
  }, {});

  // Group away players by position
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
                        disabled={startingHomePlayers.includes(player.id)}
                      />
                      <span style={{ textDecoration: startingHomePlayers.includes(player.id) ? 'line-through' : 'none' }}>
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
                        disabled={startingAwayPlayers.includes(player.id)}
                      />
                      <span style={{ textDecoration: startingAwayPlayers.includes(player.id) ? 'line-through' : 'none' }}>
                        {player.name}
                      </span>
                    </label>
                  </div>
                ))}
                <br />
              </div>
            ))}
          </div>
          <button type="button" onClick={() => addToStartingLineup(home_club_id, away_club_id, selectedHomePlayers, selectedAwayPlayers)}>Add to Starting Lineup</button>
        </form>
      )}
      {redirectToBench && (
        <Navigate
          to={{
            pathname: '/admin/bench',
            state: { home_club_id, away_club_id } // Pass club IDs as state
          }}
        />
      )}
      {message && <div style={{ color: 'green' }}>{message}</div>}
    </div>
  );
}

export default StarterAdminPage;

