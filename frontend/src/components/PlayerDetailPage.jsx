import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { PageContent } from '../Header'; // Import PageContent component

const PlayerDetailPage = () => {
  const { id } = useParams(); // Get the player ID from the URL
  const [player, setPlayer] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/players/${id}`);
        setPlayer(response.data);
      } catch (error) {
        setError('Failed to fetch player details');
      }
    };

    fetchPlayer();
  }, [id]);

  if (error) {
    return <p>{error}</p>;
  }

  if (!player) {
    return <p>Loading...</p>;
  }

  return (
    <PageContent>
      <div>
        <h2>Player Details</h2>
        <p><strong>Name:</strong> {player.name}</p>
        <p><strong>Club:</strong> {player.club_id}</p>
        <p><strong>Height:</strong> {player.height}</p>
        <p><strong>Shirt Number:</strong> {player.shirt_number}</p>
        <p><strong>Age:</strong> {player.age}</p>
        <p><strong>Date of Birth:</strong> {new Date(player.date_of_birth).toLocaleDateString()}</p>
        <p><strong>Preferred Foot:</strong> {player.preferred_foot}</p>
        <p><strong>Country:</strong> {player.country}</p>
        <p><strong>Market Value:</strong> {player.market_value}</p>
        <p><strong>Position:</strong> {player.position}</p>
      </div>
    </PageContent>
  );
};

export default PlayerDetailPage;
