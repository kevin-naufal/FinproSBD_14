import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PageContent } from '../Header'; // Import PageContent component

const PlayerPage = () => {
  const { id } = useParams();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlayerDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/players/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch player details');
        }
        const data = await response.json();
        setPlayer(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    fetchPlayerDetails();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <PageContent>
      <div>
        <h1>Player Details</h1>
        <div>
          <img src={player.image} alt={player.name} />
          <h2>{player.name}</h2>
          <p>Club: {player.club}</p>
          <p>Age: {player.age}</p>
          <p>Date of Birth: {player.date_of_birth}</p>
          <p>Shirt Number: {player.shirt_number}</p>
          <p>Country: {player.country}</p>
          <p>Preferred Foot: {player.preferred_foot}</p>
          <p>Height: {player.height} cm</p>
          <p>Market Value: ${player.market_value}</p>
          <p>Primary Position: {player.primary_position}</p>
          <p>Other Positions: {player.other_positions.join(', ')}</p>
          <p>Statistics:</p>
          <ul>
            <li>Goals: {player.goals}</li>
            <li>Assists: {player.assists}</li>
            <li>Started: {player.started}</li>
            <li>Rating: {player.rating}</li>
          </ul>
        </div>
      </div>
    </PageContent>
  );
};

export default PlayerPage;
