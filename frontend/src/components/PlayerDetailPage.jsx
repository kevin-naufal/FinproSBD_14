import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom'; // Import Link
import { PageContent } from '../Header';
import { Container, Typography, CircularProgress, Box, Button } from '@mui/material'; // Import Button
import './PlayerDetailPage.css'; // Import CSS file

const PlayerDetailPage = () => {
  const { id } = useParams();
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
    return (
      <PageContent>
        <Typography color="error">{error}</Typography>
      </PageContent>
    );
  }

  if (!player) {
    return (
      <PageContent>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
          <CircularProgress />
        </Box>
      </PageContent>
    );
  }

  return (
    <PageContent>
      <Container maxWidth="md">
      <Link to="/"> {/* Tambahkan Link */}
          <Button variant="outlined" color="primary" style={{ marginBottom: '20px' }}>Kembali</Button> {/* Tambahkan tombol kembali */}
        </Link>
        <Typography variant="h4" component="h2" className="player-name">
          Player Details
        </Typography>
        <div className="player-details">
          <div className="player-image">
            <img src={`/images/${player.id}.jpg`} alt={player.name} />
          </div>
          <div className="player-info">
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
        </div>
      </Container>
    </PageContent>
  );
};

export default PlayerDetailPage;
