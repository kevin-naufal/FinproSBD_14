import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, Navigate, useParams } from 'react-router-dom';

function BenchAdminPage() {
  const { fixture_id } = useParams();
  const [homePlayers, setHomePlayers] = useState([]);
  const [awayPlayers, setAwayPlayers] = useState([]);
  const [selectedHomePlayers, setSelectedHomePlayers] = useState([]);
  const [selectedAwayPlayers, setSelectedAwayPlayers] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [redirectToStats, setRedirectToStats] = useState(false);
  const [benchSubmitted, setBenchSubmitted] = useState(false);
  const [latestFixtureId, setLatestFixtureId] = useState(null);
  const [homeClubId, setHomeClubId] = useState(null);
  const [awayClubId, setAwayClubId] = useState(null);

  useEffect(() => {
    const fetchLatestFixture = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/fixtures/${fixture_id}`);
        const { home_club_id, away_club_id, id: latestFixtureId } = res.data;

        setHomeClubId(home_club_id);
        setAwayClubId(away_club_id);

        const homeRes = await axios.get(`http://localhost:5000/api/players/unusedInStartingLineup/${home_club_id}/${latestFixtureId}`);
        const awayRes = await axios.get(`http://localhost:5000/api/players/unusedInStartingLineup/${away_club_id}/${latestFixtureId}`);

        if (Array.isArray(homeRes.data)) {
          setHomePlayers(homeRes.data);
        } else {
          setHomePlayers([]);
          setError('Invalid data format received for home players');
        }

        if (Array.isArray(awayRes.data)) {
          setAwayPlayers(awayRes.data);
        } else {
          setAwayPlayers([]);
          setError('Invalid data format received for away players');
        }

        setLatestFixtureId(latestFixtureId);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch the latest fixture and players for bench');
      } finally {
        setLoading(false);
      }
    };
    fetchLatestFixture();
  }, []);

  useEffect(() => {
    const fetchBenchPlayers = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/players/listed_players/bench/${latestFixtureId}`);
        const benchPlayers = res.data;

        setSelectedHomePlayers(benchPlayers.filter(player => player.club_id === homeClubId).map(player => player.player_id));
        setSelectedAwayPlayers(benchPlayers.filter(player => player.club_id === awayClubId).map(player => player.player_id));
      } catch (err) {
        console.error(err);
        setError('Failed to fetch bench players');
      }
    };

    if (latestFixtureId) {
      fetchBenchPlayers();
    }
  }, [latestFixtureId]);

  const handleHomeChange = (e, playerId) => {
    if (e.target.checked) {
      console.log(`Player ${playerId} is checked.`);
      setSelectedHomePlayers([...selectedHomePlayers, playerId]);
    } else {
      console.log(`Player ${playerId} is unchecked.`);
      setSelectedHomePlayers(selectedHomePlayers.filter((id) => id !== playerId));
    }
  };

  const handleAwayChange = (e, playerId) => {
    if (e.target.checked) {
      console.log(`Player ${playerId} is checked.`);
      setSelectedAwayPlayers([...selectedAwayPlayers, playerId]);
    } else {
      console.log(`Player ${playerId} is unchecked.`);
      setSelectedAwayPlayers(selectedAwayPlayers.filter((id) => id !== playerId));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(selectedHomePlayers);
    console.log(selectedAwayPlayers);

    try {
      if (selectedHomePlayers.length !== 9 || selectedAwayPlayers.length !== 9) {
        setError('Exactly 9 players should be selected for the bench');
        setMessage('');
        return;
      }

      console.log(latestFixtureId);

      // Call the delete API
      await axios.delete(`http://localhost:5000/api/players/listed_players/bench/${latestFixtureId}`);

      // Proceed with adding players to the bench
      await Promise.all([
        Promise.all(selectedHomePlayers.map(async (playerId) => {
          const postData = { club_id: homeClubId, player_id: playerId, fixture_id: latestFixtureId };
          await axios.post('http://localhost:5000/api/bench', postData);
        })),
        Promise.all(selectedAwayPlayers.map(async (playerId) => {
          const postData = { club_id: awayClubId, player_id: playerId, fixture_id: latestFixtureId };
          await axios.post('http://localhost:5000/api/bench', postData);
        }))
      ]);

      await Promise.all([
        Promise.all(selectedHomePlayers.map(async (playerId) => {
          const postData = { club_id: homeClubId, player_id: playerId, fixture_id: latestFixtureId };
          await axios.post('http://localhost:5000/api/players/listed_players', postData);
        })),
        Promise.all(selectedAwayPlayers.map(async (playerId) => {
          const postData = { club_id: awayClubId, player_id: playerId, fixture_id: latestFixtureId };
          await axios.post('http://localhost:5000/api/players/listed_players', postData);
        }))
      ]);

      setMessage('Players added to bench successfully!');
      setError('');
      setBenchSubmitted(true);
    } catch (err) {
      console.error(err);
      setError('Failed to add players to bench');
      setMessage('');
    }
  };

  useEffect(() => {
    if (benchSubmitted) {
      setRedirectToStats(true);
    }
  }, [benchSubmitted]);

  const groupedHomePlayers = homePlayers.reduce((acc, player) => {
    if (!acc[player.position]) {
      acc[player.position] = [];
    }
    acc[player.position].push(player);
    return acc;
  }, {});

  const groupedAwayPlayers = awayPlayers.reduce((acc, player) =>
    {
      if (!acc[player.position]) {
        acc[player.position] = [];
      }
      acc[player.position].push(player);
      return acc;
    }, {});
  
    return (
      <div>
        <h1>Bench Management</h1>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        {loading ? (
          <p>Loading players...</p>
        ) : (
          <form onSubmit={handleSubmit}>
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
                        {player.name}
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
                        {player.name}
                      </label>
                    </div>
                  ))}
                  <br />
                </div>
              ))}
            </div>
            <button type="submit">Add to Bench</button>
          </form>
        )}
        {redirectToStats && <Navigate to="/admin" />}
        {message && <div style={{ color: 'green' }}>{message}</div>}
      </div>
    );
  }
  
  export default BenchAdminPage;
  
