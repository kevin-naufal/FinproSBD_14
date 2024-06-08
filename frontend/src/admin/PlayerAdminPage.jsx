import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Box } from '@mui/material';
import { PageContent } from '../Header';
import './PlayerAdminPage.css';

const PlayerAdminPage = () => {
  const [players, setPlayers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [fieldToUpdate, setFieldToUpdate] = useState('');
  const [newValue, setNewValue] = useState('');

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/players');
        setPlayers(response.data);
      } catch (error) {
        console.error('Error fetching players:', error);
      }
    };
    fetchPlayers();
  }, []);

  const handleUpdateClick = (player) => {
    setSelectedPlayer(player);
    setShowModal(true);
  };

  const handleUpdatePlayer = async () => {
    try {
      const response = await axios.put(`http://localhost:5000/api/players/${selectedPlayer.id}`, {
        updates: { [fieldToUpdate]: newValue },
      });
      setPlayers((prevPlayers) =>
        prevPlayers.map((player) =>
          player.id === response.data.id ? response.data : player
        )
      );
      setShowModal(false);
      setSelectedPlayer(null);
      setFieldToUpdate('');
      setNewValue('');
    } catch (error) {
      console.error('Error updating player:', error);
    }
  };

  return (
    <PageContent>
      <Container maxWidth="lg" className='container'>
        <Typography variant="h4" component="h1" className="admin-title">
          Player Admin Page
        </Typography>
        <TableContainer component={Paper} className="admin-table border-2 border-black">
          <Table>
            <TableHead>
              <TableRow className='bg-[#9DC08B]'>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Club ID</TableCell>
                <TableCell>Height</TableCell>
                <TableCell>Shirt Number</TableCell>
                <TableCell>Age</TableCell>
                <TableCell>Date of Birth</TableCell>
                <TableCell>Preferred Foot</TableCell>
                <TableCell>Country</TableCell>
                <TableCell>Position</TableCell>
                <TableCell>Market Value</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {players.map((player) => (
                <TableRow key={player.id} className='bg-[#EDF1D6]'>
                  <TableCell>{player.id}</TableCell>
                  <TableCell>{player.name}</TableCell>
                  <TableCell>{player.club_id}</TableCell>
                  <TableCell>{player.height}</TableCell>
                  <TableCell>{player.shirt_number}</TableCell>
                  <TableCell>{player.age}</TableCell>
                  <TableCell>{player.date_of_birth}</TableCell>
                  <TableCell>{player.preferred_foot}</TableCell>
                  <TableCell>{player.country}</TableCell>
                  <TableCell>{player.position}</TableCell>
                  <TableCell>{player.market_value}</TableCell>
                  <TableCell>
                    <Button variant="contained" color="primary" onClick={() => handleUpdateClick(player)} onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = 'white';
                        e.currentTarget.style.color = '#3f51b5';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = '#3f51b5';
                        e.currentTarget.style.color = 'white';
                      }}>
                      Update
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Modal isOpen={showModal} onRequestClose={() => setShowModal(false)} className="modal bg-[#9DC08B]" overlayClassName="overlay">
          <Typography variant="h5" component="h2">Update Player</Typography>
          <Box className="modal-content bg-[#9DC08B]">
            <div>
              <label>Field to update:</label>
              <select
                value={fieldToUpdate}
                onChange={(e) => setFieldToUpdate(e.target.value)}
              >
                <option value="">Select field</option>
                <option value="name">Name</option>
                <option value="club_id">Club ID</option>
                <option value="height">Height</option>
                <option value="shirt_number">Shirt Number</option>
                <option value="age">Age</option>
                <option value="date_of_birth">Date of Birth</option>
                <option value="preferred_foot">Preferred Foot</option>
                <option value="country">Country</option>
                <option value="position">Position</option>
                <option value="market_value">Market Value</option>
              </select>
            </div>
            <div>
              <label>New value:</label>
              <input
                type="text"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
              />
            </div>
            <Box className="modal-buttons">
              <Button variant="contained" color="primary" onClick={handleUpdatePlayer}>
                Save
              </Button>
              <Button variant="contained" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
            </Box>
          </Box>
        </Modal>
      </Container>
    </PageContent>
  );
};

export default PlayerAdminPage;
