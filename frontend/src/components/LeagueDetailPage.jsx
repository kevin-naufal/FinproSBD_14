import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { PageContent } from '../Header'; // Import PageContent component
import '../style/LeagueDetailPage.css'; // Import the CSS file for league detail page

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
      <div className="standings-container">
        <h1 className="page-title">League Standings</h1>
        <table className="standings-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Club</th>
              <th>GP</th>
              <th>W</th>
              <th>L</th>
              <th>D</th>
              <th>GD</th>
              <th>PTS</th>
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
