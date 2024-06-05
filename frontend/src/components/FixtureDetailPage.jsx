import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../style/FixtureDetailPage.css'; // Import CSS file for styling
import { PageContent } from '../Header'; // Import the PageContent component

const FixtureDetailPage = () => {
  const { fixture_id } = useParams();
  const [listedPlayers, setListedPlayers] = useState([]);
  const [playerStats, setPlayerStats] = useState([]);

  useEffect(() => {
    const fetchListedPlayers = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/players/listed_players/${fixture_id}`);
        setListedPlayers(response.data);
      } catch (error) {
        console.error('Error fetching listed players:', error);
      }
    };

    const fetchPlayerStats = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/playerStats/fixture/${fixture_id}`);
        setPlayerStats(response.data.data);
      } catch (error) {
        console.error('Error fetching player stats:', error);
      }
    };

    fetchListedPlayers();
    fetchPlayerStats();
  }, [fixture_id]);

  return (
    <PageContent>
        <div>
        <h2>Listed Players</h2>
        <table className="stats-table">
            <thead>
            <tr>
                <th>Player Name</th>
                <th>Club Name</th>
            </tr>
            </thead>
            <tbody>
            {listedPlayers.map((player) => (
                <tr key={player.id}>
                <td>{player.player_name}</td>
                <td>{player.club_name}</td>
                </tr>
            ))}
            </tbody>
        </table>
        
        <h2>Player Stats</h2>
        <table className="stats-table">
            <thead>
            <tr>
                <th>Player Name</th>
                <th>Goals</th>
                <th>Shots</th>
                <th>Shots on Target</th>
                <th>Passes</th>
                {/* Add more table headers for other stats */}
            </tr>
            </thead>
            <tbody>
            {playerStats.map((stat) => (
                <tr key={stat.id}>
                <td>{stat.player_name}</td>
                <td>{stat.goals}</td>
                <td>{stat.shots}</td>
                <td>{stat.shots_on_target}</td>
                <td>{stat.passes}</td>
                {/* Add more table cells for other stats */}
                </tr>
            ))}
            </tbody>
        </table>
        </div>
    </PageContent>
    
  );
};

export default FixtureDetailPage;
