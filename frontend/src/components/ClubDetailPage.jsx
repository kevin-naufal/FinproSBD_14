import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { PageContent } from '../Header';
import { Container, Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, CircularProgress, Button } from '@mui/material';
import '../style/ClubDetailPage.css';

const ClubDetailPage = () => {
  const { id } = useParams();
  const [club, setClub] = useState(null);
  const [standings, setStandings] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // State for loading animation

  useEffect(() => {
    const fetchClubAndStandings = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/clubs/${id}`);
        const { club, standings } = response.data;
        setClub(club);
        setStandings(standings);
        setLoading(false); // Data loaded, set loading to false
      } catch (error) {
        setError('Error fetching club and standings');
        setLoading(false); // Error occurred, set loading to false
      }
    };

    fetchClubAndStandings();
  }, [id]);

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!club || !standings) {
    return <Typography>No data available</Typography>;
  }

  return (
    <PageContent className="page-content">
      <Container maxWidth="md">
      <Link to="/"> {/* Tambahkan Link */}
      <Button
        variant="outlined"
        color="primary"
        style={{
          marginBottom: '20px',
          backgroundColor: '#3f51b5', // warna sesuai dengan outline primary default
          color: 'white',
          borderColor: '#3f51b5', // outline color
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = 'white';
          e.currentTarget.style.color = '#3f51b5';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = '#3f51b5';
          e.currentTarget.style.color = 'white';
        }}
      >
        Kembali
      </Button>
        </Link>
        <Box textAlign="center" mb={2}>
          <Typography variant="h4" component="h2" className="club-name">
            {club.name}
          </Typography>
        </Box>
        <Card className="club-card border-2 border-black">
          <CardContent>
            <Typography variant="body1">
              <strong>League:</strong> {club.league_name} - {club.league_country}
            </Typography>
            <Typography variant="body1">
              <strong>Manager:</strong> {club.manager}
            </Typography>
            <Typography variant="body1">
              <strong>Stadium:</strong> {club.stadium}
            </Typography>
          </CardContent>
        </Card>

        <Typography variant="h5" component="h3" className="standings-title">
          Standings
        </Typography>
        <TableContainer component={Paper} className="standings-table border-2 border-black">
          <Table>
            <TableHead>
              <TableRow className='bg-[#9DC08B]'>
                <TableCell>Rank</TableCell>
                <TableCell>Club</TableCell>
                <TableCell>Games Played</TableCell>
                <TableCell>Wins</TableCell>
                <TableCell>Losses</TableCell>
                <TableCell>Draws</TableCell>
                <TableCell>Goal Difference</TableCell>
                <TableCell>Points</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {standings.map((standing, index) => (
                <TableRow key={index} className='bg-[#EDF1D6]'>
                  <TableCell>{standing.rank}</TableCell>
                  <TableCell>{standing.club_name}</TableCell>
                  <TableCell>{standing.games_played}</TableCell>
                  <TableCell>{standing.wins}</TableCell>
                  <TableCell>{standing.losses}</TableCell>
                  <TableCell>{standing.draws}</TableCell>
                  <TableCell>{standing.goal_difference}</TableCell>
                  <TableCell>{standing.points}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </PageContent>
  );
};

export default ClubDetailPage;
