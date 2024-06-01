import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { PageContent } from '../Header'; // Import the PageContent component

const ClubDetailPage = () => {
  const { id } = useParams(); // Get the club ID from the URL params
  const [club, setClub] = useState(null);
  const [standings, setStandings] = useState([]);
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

    fetchClubAndStandings();
  }, [id]);

  if (error) {
    return <p>{error}</p>;
  }

  if (!club || !standings) {
    return <p>Loading...</p>;
  }

  return (
    <PageContent> {/* Apply padding to the content */}
      <div>
        <h2>{club.name}</h2>
        <p><strong>League:</strong> {club.league_name} - {club.league_country}</p> {/* Display league name and country */}
        <p><strong>Manager:</strong> {club.manager}</p>
        <p><strong>Stadium:</strong> {club.stadium}</p>

        <h3>Standings</h3>
        <table>
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
    </PageContent>
  );
};

export default ClubDetailPage;
