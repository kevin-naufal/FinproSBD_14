import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { PageContent } from '../Header'; // Import PageContent component

const LeagueDetailPage = () => {
  const [standings, setStandings] = useState([]);
  const { league_id } = useParams();

  useEffect(() => {
    const fetchStandings = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/standings/${league_id}`);
        setStandings(response.data);
      } catch (error) {
        console.error('Error fetching standings:', error);
      }
    };

    fetchStandings();
  }, [league_id]);

  return (
    <PageContent> {/* Wrap content with PageContent */}
      <div>
        <h1>League Standings</h1>
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
            {standings.map((standing) => (
              <tr key={standing.id}>
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

export default LeagueDetailPage;
