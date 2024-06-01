import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PlayerStatsAdminPage() {
  const [listedPlayers, setListedPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState([]);
  const [message, setMessage] = useState(null); // State to hold the success or failure message

  useEffect(() => {
    const fetchLatestFixture = async () => {
      try {
        // Fetch the latest fixture ID
        const latestFixtureRes = await axios.get('http://localhost:5000/api/fixtures/latest');
        const latestFixtureId = latestFixtureRes.data.id;

        // Fetch listed players for the latest fixture
        const listedPlayersRes = await axios.get(`http://localhost:5000/api/players/listed_players/${latestFixtureId}`);
        setListedPlayers(listedPlayersRes.data);

        // Initialize form data for each listed player
        const initialFormData = listedPlayersRes.data.map(player => ({
          player_id: player.player_id,
          club_id: player.club_id,
          fixture_id: latestFixtureId,
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
        }));
        setFormData(initialFormData);

      } catch (error) {
        console.error('Error fetching listed players:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestFixture();
  }, []);

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const updatedFormData = [...formData];
    updatedFormData[index] = { ...updatedFormData[index], [name]: value };
    setFormData(updatedFormData);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Ensure that empty textboxes are set to '0'
    const sanitizedFormData = formData.map(playerData => {
      const sanitizedData = {};
      for (const key in playerData) {
        sanitizedData[key] = playerData[key] === '' ? '0' : playerData[key];
      }
      return sanitizedData;
    });

    try {
      // Send POST request for each player's stats
      const postRequests = sanitizedFormData.map(playerData => axios.post('http://localhost:5000/api/playerStats/', playerData));
      await Promise.all(postRequests);

      // Set success message
      setMessage('Player stats added successfully');
    } catch (error) {
      // Set failure message
      setMessage('Error adding player stats');
      console.error('Error adding player stats:', error);
    }
  };

  // Group players by club ID
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
          {message && <p>{message}</p>} {/* Display the success or failure message */}
          {Object.entries(playersByClub).map(([clubId, players]) => (
            <div key={clubId}>
              <h2>Club: {players[0].club_name}</h2>
              <form onSubmit={handleSubmit}>
                <table>
                  <thead>
                    <tr>
                      <th>Player Name</th>
                      <th>Shots</th>
                      <th>Shots on Target</th>
                      <th>Passes</th>
                      <th>Goals</th>
                      <th>Assists</th>
                      <th>Tackles</th>
                      <th>Interceptions</th>
                      <th>Saves</th>
                      <th>Fouls Committed</th>
                      <th>Corners</th>
                      <th>Offsides</th>
                      <th>Yellow Cards</th>
                      <th>Red Cards</th>
                      <th>Ratings</th>
                    </tr>
                  </thead>
                  <tbody>
                    {players.map((player, index) => (
                      <tr key={index}>
                        <td>{player.player_name}</td>
                        <td><input type="text" name="shots" value={formData[index].shots} onChange={(e) => handleInputChange(index, e)} /></td>
                        <td><input type="text" name="shots_on_target" value={formData[index].shots_on_target} onChange={(e) => handleInputChange(index, e)} /></td>
                        <td><input type="text" name="passes" value={formData[index].passes} onChange={(e) => handleInputChange(index, e)} /></td>
                        <td><input type="text" name="goals" value={formData[index].goals} onChange={(e) => handleInputChange(index, e)} /></td>
                        <td><input type="text" name="assists" value={formData[index].assists} onChange={(e) => handleInputChange(index, e)} /></td>
                        <td><input type="text" name="tackles" value={formData[index].tackles} onChange={(e) => handleInputChange(index, e)} /></td>
                        <td><input type="text" name="interceptions" value={formData[index].interceptions} onChange={(e) => handleInputChange(index, e)} /></td>
                        <td><input type="text" name="saves" value={formData[index].saves} onChange={(e) => handleInputChange(index, e)} /></td>
                        <td><input type="text" name="fouls_committed" value={formData[index].fouls_committed} onChange={(e) => handleInputChange(index, e)} /></td>
                        <td><input type="text" name="corners" value={formData[index].corners} onChange={(e) => handleInputChange(index, e)} /></td>
                        <td><input type="text" name="offsides" value={formData[index].offsides} onChange={(e) => handleInputChange(index, e)} /></td>
                        <td><input type="text" name="yellow_cards" value={formData[index].yellow_cards} onChange={(e) => handleInputChange(index, e)} /></td>
                        <td><input type="text" name="red_cards" value={formData[index].red_cards} onChange={(e) => handleInputChange(index, e)} /></td>
                        <td><input type="text" name="ratings" value={formData[index].ratings} onChange={(e) => handleInputChange(index, e)} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button type="submit">Submit</button>
              </form>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PlayerStatsAdminPage;
