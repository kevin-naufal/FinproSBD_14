import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Box } from '@mui/material';
import { PageContent } from '../Header';
import './ClubAdminPage.css';

const ClubAdminPage = () => {
  const [clubs, setClubs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [updatedClub, setUpdatedClub] = useState(null);
  const [updatedFields, setUpdatedFields] = useState({});

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/clubs');
        setClubs(response.data);
      } catch (error) {
        console.error('Error fetching clubs:', error);
      }
    };
    fetchClubs();
  }, []);

  const handleUpdateClub = (club) => {
    setUpdatedClub(club);
    setUpdatedFields({
      league_id: club.league_id,
      name: club.name,
      manager: club.manager,
      stadium: club.stadium,
    });
    setShowModal(true);
  };

  const handleFieldChange = (field, value) => {
    setUpdatedFields((prevFields) => ({
      ...prevFields,
      [field]: value,
    }));
  };

  const handleUpdateConfirm = async () => {
    if (updatedClub) {
      try {
        await axios.put(`http://localhost:5000/api/clubs/${updatedClub.id}`, { updates: updatedFields });
        setClubs((prevClubs) =>
          prevClubs.map((club) =>
            club.id === updatedClub.id
              ? { ...club, ...updatedFields }
              : club
          )
        );
        setShowModal(false);
        setUpdatedClub(null);
        setUpdatedFields({});
      } catch (error) {
        console.error('Error updating club:', error);
      }
    }
  };

  return (
    <PageContent>
      <Container maxWidth="lg" className='container'>
        <Typography variant="h4" component="h1" className="admin-title">
          Club Admin Page
        </Typography>
        <TableContainer component={Paper} className="admin-table border-2 border-black">
          <Table>
            <TableHead>
              <TableRow className='bg-[#9DC08B]'>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Manager</TableCell>
                <TableCell>Stadium</TableCell>
                <TableCell>League</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clubs.map((club) => (
                <TableRow key={club.id} className='bg-[#EDF1D6]'>
                  <TableCell>{club.id}</TableCell>
                  <TableCell>{club.name}</TableCell>
                  <TableCell>{club.manager}</TableCell>
                  <TableCell>{club.stadium}</TableCell>
                  <TableCell>{club.league_name}</TableCell>
                  <TableCell>
                    <Button variant="contained" color="primary" onClick={() => handleUpdateClub(club)} onMouseOver={(e) => {
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
          <Typography variant="h5" component="h2">Update Club</Typography>
          <Box className="modal-content bg-[#9DC08B]">
            <div>
              <label>Name:</label>
              <input
                type="text"
                value={updatedFields.name}
                onChange={(e) => handleFieldChange('name', e.target.value)}
              />
            </div>
            <div>
              <label>Manager:</label>
              <input
                type="text"
                value={updatedFields.manager}
                onChange={(e) => handleFieldChange('manager', e.target.value)}
              />
            </div>
            <div>
              <label>Stadium:</label>
              <input
                type="text"
                value={updatedFields.stadium}
                onChange={(e) => handleFieldChange('stadium', e.target.value)}
              />
            </div>
            <Box className="modal-buttons bg-[#9DC08B]">
              <Button variant="contained" color="primary" onClick={handleUpdateConfirm}>
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

export default ClubAdminPage;
