import React, { useState, useEffect } from 'react';
import axios from 'axios';
<<<<<<< HEAD
import { useParams, Link } from 'react-router-dom';
import { PageContent } from '../Header';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, CircularProgress, Button } from '@mui/material';
import './LeagueDetailPage.css';
=======
import { useParams } from 'react-router-dom';
import { PageContent } from '../Header'; // Import PageContent component
import '../style/LeagueDetailPage.css'; // Import the CSS file for league detail page
>>>>>>> 0d1b3a4d3c7f2dc932fe330dee0ebff6d6e60ac1

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

  if (standings.length === 0) {
    return (
      <PageContent>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
          <CircularProgress />
        </Box>
      </PageContent>
    );
  }

  return (
<<<<<<< HEAD
    <PageContent>
      <Container maxWidth="md">
        <Button component={Link} to="/" variant="contained" color="primary" style={{ marginBottom: '20px' }}>
          Back
        </Button>
        <Typography variant="h4" component="h1" className="standings-title">
          League Standings
        </Typography>
        <TableContainer component={Paper} className="standings-table">
          <Table>
            <TableHead>
              <TableRow>
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
              {standings.map((standing) => (
                <TableRow key={standing.id}>
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
=======
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
>>>>>>> 0d1b3a4d3c7f2dc932fe330dee0ebff6d6e60ac1
    </PageContent>
  );
};

export default LeagueDetailPage;
