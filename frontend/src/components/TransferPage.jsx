import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PageContent } from '../Header'; // Import PageContent component
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, CircularProgress } from '@mui/material';

const TransfersPage = () => {
  const [transfers, setTransfers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true); // State for loading animation

  useEffect(() => {
    const fetchTransfers = async () => {
      try {
        // Fetch transferred players
        const response = await axios.get('http://localhost:5000/api/transfers');
        setTransfers(response.data);
        setLoading(false); // Data loaded, set loading to false
      } catch (error) {
        // Display error message if the request fails
        setError('Failed to fetch transfers');
        setLoading(false); // Error occurred, set loading to false
      }
    };

    fetchTransfers();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <PageContent> {/* Wrap content with PageContent */}
      <Container maxWidth="md">
        <Typography variant="h4" component="h2" style={{ marginBottom: '20px', textAlign: 'center' }}>
          Transfers
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
        <TableContainer component={Paper} className="transfers-table border-2 border-black">
          <Table>
            <TableHead>
              <TableRow className='bg-[#9DC08B]'>
                <TableCell>Player</TableCell>
                <TableCell>Age</TableCell>
                <TableCell>Market Value</TableCell>
                <TableCell>Nationality</TableCell>
                <TableCell>Left Club</TableCell>
                <TableCell>Joined Club</TableCell>
                <TableCell>Fee</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transfers.map((transfer, index) => (
                <TableRow key={index} className={index % 2 === 0 ? 'bg-[#EDF1D6]' : 'bg-[#fff]'}>
                  <TableCell>{transfer.player}</TableCell>
                  <TableCell>{transfer.age}</TableCell>
                  <TableCell>{transfer.market_value}</TableCell>
                  <TableCell>{transfer.nationality}</TableCell>
                  <TableCell>{transfer.left}</TableCell>
                  <TableCell>{transfer.joined}</TableCell>
                  <TableCell>{transfer.fee}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </PageContent>
  );
};

export default TransfersPage;
