import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PageContent } from '../Header'; // Import the PageContent component
import '../style/styles.css'; // Make sure to import the CSS file
import { Link, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  CircularProgress,
  Button,
} from "@mui/material";

const FixturePage = () => {
  const [fixtures, setFixtures] = useState([]);
  const [selectedMatchweek, setSelectedMatchweek] = useState('1');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFixtures = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/fixtures/matchweek/${selectedMatchweek}`);
        setFixtures(response.data);
      } catch (error) {
        console.error('Failed to fetch fixtures:', error);
      }
    };

    if (selectedMatchweek !== '') {
      fetchFixtures();
    } else {
      setFixtures([]);
    }
  }, [selectedMatchweek]);

  const handleMatchweekChange = (event) => {
    setSelectedMatchweek(event.target.value);
  };

  const handleCardClick = (fixtureId) => {
    navigate(`/fixture/${fixtureId}`);
  };

  const handleLeagueClick = (leagueId) => {
    navigate(`/leagues/${leagueId}`);
  };

  const groupedFixtures = {};
  fixtures.forEach((fixture) => {
    const { league_name } = fixture;
    if (!groupedFixtures[league_name]) {
      groupedFixtures[league_name] = [];
    }
    groupedFixtures[league_name].push(fixture);
  });

  return (
    <PageContent>
      <Container maxWidth="md">
        <Box className="mb-8 p-6 border rounded-lg shadow-lg bg-white w-full max-w-4xl border-2 border-black bg-[#609966]">
          <label htmlFor="matchweek" className="block mb-2">Select Matchweek: </label>
          <select
            id="matchweek"
            value={selectedMatchweek}
            onChange={handleMatchweekChange}
            className="border p-2 rounded shadow outline-none"
            style={{ borderColor: '#ccc', width: '150px' }}
          >
            {[...Array(38).keys()].map((week) => (
              <option key={week + 1} value={week + 1}>Matchweek {week + 1}</option>
            ))}
          </select>
        </Box>

        {Object.keys(groupedFixtures).map((leagueName, index) => (
          <Box key={index} className="mb-8 p-6 border rounded-lg shadow-lg bg-white w-full max-w-4xl border-2 border-black bg-[#9DC08B]">
            <Typography variant="h4" component="h2" className="text-2xl font-semibold mb-4 border-b pb-2">
              <Button
                className="league-button"
                onClick={() => handleLeagueClick(groupedFixtures[leagueName][0].league_id)}
                style={{ color: 'black', textTransform: 'none' }} // Set text color to black and disable text transformation
              >
                {leagueName}
              </Button>
            </Typography>
            <TableContainer component={Paper} className="standings-table border-2 border-black">
              <Table>
                <TableHead>
                  <TableRow className="bg-[#9DC08B]">
                    <TableCell>Home Team</TableCell>
                    <TableCell>Score</TableCell>
                    <TableCell>Away Team</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {groupedFixtures[leagueName].map((fixture, fixtureIndex) => (
                    <TableRow key={fixtureIndex} className="bg-[#EDF1D6]" onClick={() => handleCardClick(fixture.id)} style={{ cursor: 'pointer' }}>
                      <TableCell className="club-name-hover">
                        <Link to={`/club/${fixture.home_club_id}`} onClick={(event) => event.stopPropagation()}>
                          {fixture.home_club_name}
                        </Link>
                      </TableCell>
                      <TableCell className="score-line">
                        <span className="score">{fixture.home_score}</span>
                        <span className="dash">-</span>
                        <span className="score">{fixture.away_score}</span>
                      </TableCell>
                      <TableCell className="club-name-hover">
                        <Link to={`/club/${fixture.away_club_id}`} onClick={(event) => event.stopPropagation()}>
                          {fixture.away_club_name}
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        ))}
      </Container>
    </PageContent>
  );
}

export default FixturePage;
