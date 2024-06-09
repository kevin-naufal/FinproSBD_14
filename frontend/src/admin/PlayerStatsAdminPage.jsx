import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

function PlayerStatsAdminPage() {
  const [listedPlayers, setListedPlayers] = useState([]);
  const [fixtures, setFixtures] = useState([]);
  const [selectedFixture, setSelectedFixture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState(null);
  const [homeClubStats, setHomeClubStats] = useState(null);
  const [awayClubStats, setAwayClubStats] = useState(null);
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fixturesRes = await axios.get('http://localhost:5000/api/fixtures');
        setFixtures(fixturesRes.data);

        if (fixturesRes.data.length > 0) {
          await fetchListedPlayers(fixturesRes.data[0].id);
        }
      } catch (error) {
        console.error('Error fetching fixtures and listed players:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchListedPlayers = async (fixtureId) => {
    try {
      const listedPlayersRes = await axios.get(`http://localhost:5000/api/players/listed_players/${fixtureId}`);
      setListedPlayers(listedPlayersRes.data);

      const initialFormData = listedPlayersRes.data.reduce((acc, player) => {
        if (!acc[player.club_id]) {
          acc[player.club_id] = [];
        }
        acc[player.club_id].push({
          player_id: player.player_id,
          club_id: player.club_id,
          fixture_id: fixtureId,
          shots: '',
          shots_on_target: '',
          passes: '',
          goals: '',
          assists: '',
          tackles: '',
          interceptions: '',
          saves: '',
          fouls_committed: '',
          corners: '',
          offsides: '',
          yellow_cards: '',
          red_cards: '',
          ratings: ''
        });
        return acc;
      }, {});
      setFormData(initialFormData);
    } catch (error) {
      console.error('Error fetching listed players:', error);
    }
  };

  const handleFixtureChange = (event) => {
    const fixtureId = event.target.value;
    setSelectedFixture(fixtureId);
    fetchListedPlayers(fixtureId);
  };

  const handleInputChange = (clubId, index, event) => {
    const { name, value } = event.target;
    const updatedClubData = [...formData[clubId]];
    updatedClubData[index] = { ...updatedClubData[index], [name]: value };
    setFormData({ ...formData, [clubId]: updatedClubData });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const sanitizedFormData = Object.values(formData).flat().map(playerData => {
      const sanitizedData = {};
      for (const key in playerData) {
        sanitizedData[key] = playerData[key] === '' ? '0' : playerData[key];
      }
      return sanitizedData;
    });

    try {
      // Delete existing player stats for the selected fixture
      await axios.delete(`http://localhost:5000/api/playerStats/fixture/${selectedFixture}`);

      // After successful deletion, make the POST request to add new player stats
      const postRequests = sanitizedFormData.map(playerData => axios.post('http://localhost:5000/api/playerStats/', playerData));
      await Promise.all(postRequests);
      setMessage('Player stats added successfully');

      

try {
  const fixturesRes = await axios.get(`http://localhost:5000/api/fixtures/${selectedFixture}`);
  const { home_club_id, away_club_id, league_id } = fixturesRes.data;

  console.log('Home Club ID:', home_club_id);
  console.log('Away Club ID:', away_club_id);
  console.log('League ID:', league_id);

  const homeclubstatsRes = await axios.get(`http://localhost:5000/api/playerStats/fixture/${selectedFixture}/stats/${home_club_id}`);
  const awayclubstatsRes = await axios.get(`http://localhost:5000/api/playerStats/fixture/${selectedFixture}/stats/${away_club_id}`);

  const homeClubStats = homeclubstatsRes.data[0];
  const awayClubStats = awayclubstatsRes.data[0];

  setHomeClubStats(homeClubStats);
  setAwayClubStats(awayClubStats);
  

  let games_played_home, wins_home, losses_home, draws_home, goal_difference_home, points_home;
  const HomestandingsRes = await axios.get(`http://localhost:5000/api/standings/club/${home_club_id}`);
  const homeStandings = HomestandingsRes.data;
  console.log('Home Standings:');
  homeStandings.forEach((standing) => {
    const { id, club_id, league_id, rank, games_played, wins, losses, draws, goal_difference, points } = standing;
    games_played_home = games_played;
    wins_home = wins;
    losses_home = losses;
    draws_home = draws;
    goal_difference_home = goal_difference;
    points_home = points;

    console.log('ID:', id);
    console.log('Club ID:', club_id);
    console.log('League ID:', league_id);
    console.log('Rank:', rank);
    console.log('Games Played:', games_played_home);
    console.log('Wins:', wins_home);
    console.log('Losses:', losses_home);
    console.log('Draws:', draws_home);
    console.log('Goal Difference:', goal_difference_home);
    console.log('Points:', points_home);
  });

  let games_played_away, wins_away, losses_away, draws_away, goal_difference_away, points_away;
  const AwaystandingsRes = await axios.get(`http://localhost:5000/api/standings/club/${away_club_id}`);
  const awayStandings = AwaystandingsRes.data;
  console.log('Away Standings:');
  awayStandings.forEach((standing) => {
    const { id, club_id, league_id, rank, games_played, wins, losses, draws, goal_difference, points } = standing;
    games_played_away = games_played;
    wins_away = wins;
    losses_away = losses;
    draws_away = draws;
    goal_difference_away = goal_difference;
    points_away = points;

    console.log('ID:', id);
    console.log('Club ID:', club_id);
    console.log('League ID:', league_id);
    console.log('Rank:', rank);
    console.log('Games Played:', games_played_away);
    console.log('Wins:', wins_away);
    console.log('Losses:', losses_away);
    console.log('Draws:', draws_away);
    console.log('Goal Difference:', goal_difference_away);
    console.log('Points:', points_away);
  });

  // Patch request for home club
  await axios.patch(`http://localhost:5000/api/standings/club/${home_club_id}`, {
    games_played: games_played_home + 1,
    wins: homeClubStats.total_goals > awayClubStats.total_goals ? wins_home + 1 : wins_home,
    losses: homeClubStats.total_goals < awayClubStats.total_goals ? losses_home + 1 : losses_home,
    draws: homeClubStats.total_goals === awayClubStats.total_goals ? draws_home + 1 : draws_home,
    goal_difference: homeClubStats.total_goals - awayClubStats.total_goals,
    points: homeClubStats.total_goals > awayClubStats.total_goals ? points_home + 3 : homeClubStats.total_goals === awayClubStats.total_goals ? points_home + 1 : points_home,
  });

  console.log('Successfully patched standings for home club');
  
  // Patch request for away club
  await axios.patch(`http://localhost:5000/api/standings/club/${away_club_id}`, {
    games_played: games_played_away + 1,
    wins: awayClubStats.total_goals > homeClubStats.total_goals ? wins_away + 1 : wins_away,
    losses: awayClubStats.total_goals < homeClubStats.total_goals ? losses_away + 1 : losses_away,
    draws: awayClubStats.total_goals === homeClubStats.total_goals ? draws_away + 1 : draws_away,
    goal_difference: awayClubStats.total_goals - homeClubStats.total_goals,
    points: awayClubStats.total_goals > homeClubStats.total_goals ? points_away + 3 : awayClubStats.total_goals === homeClubStats.total_goals ? points_away + 1 : points_away,
  });

  console.log('Successfully patched standings for away club');

} catch (error) {
  console.error('Error:', error);
}

    } catch (error) {
      setMessage('Error adding player stats');
      console.error('Error adding player stats:', error);
    }
  };

  const playersByClub = listedPlayers.reduce((acc, player) => {
    if (!acc[player.club_id]) {
      acc[player.club_id] = [];
    }
    acc[player.club_id].push(player);
    return acc;
  }, {});

  return (
    <div>
      <h1>Player Stats</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {message && <p>{message}</p>}
          <label htmlFor="fixture-select">Select Fixture:</label>
          <select id="fixture-select" value={selectedFixture} onChange={handleFixtureChange}>
            <option value="">Select a fixture</option>
            {fixtures.map((fixture) => (
              <option key={fixture.id} value={fixture.id}>
                {`Fixture ID ${fixture.id}`}
              </option>
            ))}
          </select>

          {selectedFixture && (
            <form onSubmit={handleSubmit}>
              {Object.entries(playersByClub).map(([clubId, players]) => (
                <div key={clubId}>
                  <h2>Club: {players[0].club_name}</h2>
                  <table style={{ border: '1px solid black', borderCollapse: 'collapse', width: '100%' }}>
                    <thead>
                      <tr>
                        <th style={{ border: '1px solid black', padding: '4px', fontSize: '12px' }}>Player Name</th>
                        <th style={{ border: '1px solid black', padding: '4px', fontSize: '12px' }}>Shots</th>
                        <th style={{ border: '1px solid black', padding: '4px', fontSize: '12px' }}>Shots on Target</th>
                        <th style={{ border: '1px solid black', padding: '4px', fontSize: '12px' }}>Passes</th>
                        <th style={{ border: '1px solid black', padding: '4px', fontSize: '12px' }}>Goals</th>
                        <th style={{ border: '1px solid black', padding: '4px', fontSize: '12px' }}>Assists</th>
                        <th style={{ border: '1px solid black', padding: '4px', fontSize: '12px' }}>Tackles</th>
                        <th style={{ border: '1px solid black', padding: '4px', fontSize: '12px' }}>Interceptions</th>
                        <th style={{ border: '1px solid black', padding: '4px', fontSize: '12px' }}>Saves</th>
                        <th style={{ border: '1px solid black', padding: '4px', fontSize: '12px' }}>Fouls Committed</th>
                        <th style={{ border: '1px solid black', padding: '4px', fontSize: '12px' }}>Corners</th>
                        <th style={{ border: '1px solid black', padding: '4px', fontSize: '12px' }}>Offsides</th>
                        <th style={{ border: '1px solid black', padding: '4px', fontSize: '12px' }}>Yellow Cards</th>
                        <th style={{ border: '1px solid black', padding: '4px', fontSize: '12px' }}>Red Cards</th>
                        <th style={{ border: '1px solid black', padding: '4px', fontSize: '12px' }}>Ratings</th>
                      </tr>
                    </thead>
                    <tbody>
                      {players.map((player, index) => (
                        <tr key={index}>
                          <td style={{ border: '1px solid black', padding: '4px', fontSize: '16px' }}>{player.player_name}</td>
                          <td style={{ border: '1px solid black', padding: '4px', fontSize: '16px' }}><input type="text" name="shots" value={formData[clubId][index].shots} onChange={(e) => handleInputChange(clubId, index, e)} style={{ width: '50px' }} /></td>
                          <td style={{ border: '1px solid black', padding: '4px', fontSize: '16px' }}><input type="text" name="shots_on_target" value={formData[clubId][index].shots_on_target} onChange={(e) => handleInputChange(clubId, index, e)} style={{ width: '50px' }} /></td>
                          <td style={{ border: '1px solid black', padding: '4px', fontSize: '16px' }}><input type="text" name="passes" value={formData[clubId][index].passes} onChange={(e) => handleInputChange(clubId, index, e)} style={{ width: '50px' }} /></td>
                          <td style={{ border: '1px solid black', padding: '4px', fontSize: '16px' }}><input type="text" name="goals" value={formData[clubId][index].goals} onChange={(e) => handleInputChange(clubId, index, e)} style={{ width: '50px' }} /></td>
                          <td style={{ border: '1px solid black', padding: '4px', fontSize: '16px' }}><input type="text" name="assists" value={formData[clubId][index].assists} onChange={(e) => handleInputChange(clubId, index, e)} style={{ width: '50px' }} /></td>
                          <td style={{ border: '1px solid black', padding: '4px', fontSize: '16px' }}><input type="text" name="tackles" value={formData[clubId][index].tackles} onChange={(e) => handleInputChange(clubId, index, e)} style={{ width: '50px' }} /></td>
                          <td style={{ border: '1px solid black', padding: '4px', fontSize: '16px' }}><input type="text" name="interceptions" value={formData[clubId][index].interceptions} onChange={(e) => handleInputChange(clubId, index, e)} style={{ width: '50px' }} /></td>
                          <td style={{ border: '1px solid black', padding: '4px', fontSize: '16px' }}><input type="text" name="saves" value={formData[clubId][index].saves} onChange={(e) => handleInputChange(clubId, index, e)} style={{ width: '50px' }} /></td>
                          <td style={{ border: '1px solid black', padding: '4px', fontSize: '16px' }}><input type="text" name="fouls_committed" value={formData[clubId][index].fouls_committed} onChange={(e) => handleInputChange(clubId, index, e)} style={{ width: '50px' }} /></td>
                          <td style={{ border: '1px solid black', padding: '4px', fontSize: '16px' }}><input type="text" name="corners" value={formData[clubId][index].corners} onChange={(e) => handleInputChange(clubId, index, e)} style={{ width: '50px' }} /></td>
                          <td style={{ border: '1px solid black', padding: '4px', fontSize: '16px' }}><input type="text" name="offsides" value={formData[clubId][index].offsides} onChange={(e) => handleInputChange(clubId, index, e)} style={{ width: '50px' }} /></td>
                          <td style={{ border: '1px solid black', padding: '4px', fontSize: '16px' }}><input type="text" name="yellow_cards" value={formData[clubId][index].yellow_cards} onChange={(e) => handleInputChange(clubId, index, e)} style={{ width: '50px' }} /></td>
                          <td style={{ border: '1px solid black', padding: '4px', fontSize: '16px' }}><input type="text" name="red_cards" value={formData[clubId][index].red_cards} onChange={(e) => handleInputChange(clubId, index, e)} style={{ width: '50px' }} /></td>
                          <td style={{ border: '1px solid black', padding: '4px', fontSize: '16px' }}><input type="text" name="ratings" value={formData[clubId][index].ratings} onChange={(e) => handleInputChange(clubId, index, e)} style={{ width: '50px' }} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
              <button type="submit">Submit</button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}

export default PlayerStatsAdminPage;

