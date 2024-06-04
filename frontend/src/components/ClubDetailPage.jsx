import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { PageContent } from '../Header'; // Import the PageContent component
import '../style/ClubDetailPage.css'; // Import the CSS file for club detail page

const ClubDetailPage = () => {
  const { id } = useParams(); // Get the club ID from the URL params
  const [club, setClub] = useState(null);
  const [standings, setStandings] = useState([]);
  const [players, setPlayers] = useState([]); // State for players
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClubAndStandings = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/clubs/${id}`);
        const { club, standings } = response.data;
        setClub(club);
        setStandings(standings);
      } catch (error) {
        setError('Error fetching club and standings');
      }
    };

    const fetchPlayers = async () => { // Fetch players
      try {
        const response = await axios.get(`http://localhost:5000/api/players/club/${id}`);
        setPlayers(response.data);
      } catch (error) {
        setError('Error fetching players');
      }
    };

    fetchClubAndStandings();
    fetchPlayers(); // Call the fetchPlayers function
  }, [id]);

  if (error) {
    return <p>{error}</p>;
  }

  if (!club || !standings || !players) {
    return <p>Loading...</p>;
  }

  // Group players based on their positions
  const groupedPlayers = {
    Goalkeeper: [],
    Defender: [],
    Midfielder: [],
    Forward: [],
  };

  players.forEach((player) => {
    switch (player.position) {
      case 'Keeper':
        groupedPlayers.Goalkeeper.push(player);
        break;
      case 'Center-Back':
      case 'Right-Back':
      case 'Left-Back':
      case 'Right Wing-Back':
      case 'Left Wing-Back':
        groupedPlayers.Defender.push(player);
        break;
      case 'Central Midfielder':
      case 'Defensive Midfielder':
      case 'Attacking Midfielder':
      case 'Left Midfielder':
      case 'Right Midfielder':
        groupedPlayers.Midfielder.push(player);
        break;
      case 'Striker':
      case 'Right Winger':
      case 'Left Winger':
      case 'Right Wing':
        groupedPlayers.Forward.push(player);
        break;
      default:
        break;
    }
  });

  // Function to format the shirt number
  const formatShirtNumber = (number) => {
    return number < 10 ? `0${number}` : number;
  };

  // Render players grouped by position
  return (
    <PageContent>
      <div className="club-detail-container">
        <h2 className="club-name">{club.name}</h2>
        <p className="league-details"><strong>League:</strong> {club.league_name} - {club.league_country}</p>
        <p className="league-details"><strong>Manager:</strong> {club.manager}</p>
        <p className="league-details"><strong>Stadium:</strong> {club.stadium}</p>

        <div className="standings-container">
          <h3>Standings</h3>
          <table className="standings-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Club</th>
                <th>Games Played</th>
                <th>Wins</th>
                <th>Losses</th>
                <th>Draws</th>
                <th>Goal Difference</th>
                <th>Points</th>
              </tr>
            </thead>
            <tbody>
              {standings.map((standing, index) => (
                <tr key={index}>
                  <td>{standing.rank}</td>
                  <td>{standing.club_name}</td>
                  <td>{standing.games_played}</td>
                  <td>{standing.wins}</td>
                  <td>{standing.losses}</td>
                  <td>{standing.draws}</td>
                  <td>{standing.goal_difference}</td>
                  <td>{standing.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3>Squad</h3>
        <div className="players-list">
          {Object.entries(groupedPlayers).map(([position, players]) => (
            <div key={position} className="player-group">
              <h4 className="position-label">{position}</h4>
              <ul className="player-names">
                {players.map((player) => (
                  <li key={player.id}>
                    {formatShirtNumber(player.shirt_number)} - {player.name} ({player.country})
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </PageContent>
  );
};

export default ClubDetailPage;
