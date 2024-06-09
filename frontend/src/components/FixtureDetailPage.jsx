import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../style/FixtureDetailPage.css"; // Import CSS file for styling
import { PageContent } from "../Header"; // Import the PageContent component
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
} from "@mui/material";

const FixtureDetailPage = () => {
  const { fixture_id } = useParams();
  const [listedPlayers, setListedPlayers] = useState([]);
  const [playerStats, setPlayerStats] = useState([]);

  useEffect(() => {
    const fetchListedPlayers = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/players/listed_players/${fixture_id}`
        );
        setListedPlayers(response.data);
      } catch (error) {
        console.error("Error fetching listed players:", error);
      }
    };

    const fetchPlayerStats = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/playerStats/fixture/${fixture_id}`
        );
        setPlayerStats(response.data.data);
      } catch (error) {
        console.error("Error fetching player stats:", error);
      }
    };

    fetchListedPlayers();
    fetchPlayerStats();
  }, [fixture_id]);

  if (listedPlayers.length === 0 && playerStats.length === 0) {
    return (
      <PageContent>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
        >
          <CircularProgress />
        </Box>
      </PageContent>
    );
  }

  return (
    <PageContent>
      <Container maxWidth="md">
        <Typography variant="h4" component="h2" gutterBottom>
          Listed Players
        </Typography>
        <TableContainer component={Paper} className="border-2 border-black">
          <Table>
            <TableHead>
              <TableRow className="bg-[#9DC08B]">
                <TableCell>Player Name</TableCell>
                <TableCell>Club Name</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {listedPlayers.map((player) => (
                <TableRow key={player.id} className="bg-[#EDF1D6]">
                  <TableCell>{player.player_name}</TableCell>
                  <TableCell>{player.club_name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Typography variant="h4" component="h2" gutterBottom style={{ marginTop: '20px' }}>
          Player Stats
        </Typography>
        <TableContainer component={Paper} className="border-2 border-black">
          <Table>
            <TableHead>
              <TableRow className="bg-[#9DC08B]">
                <TableCell>Player Name</TableCell>
                <TableCell>Goals</TableCell>
                <TableCell>Shots</TableCell>
                <TableCell>Shots on Target</TableCell>
                <TableCell>Passes</TableCell>
                <TableCell>Assists</TableCell>
                <TableCell>Tackles</TableCell>
                {/* Add more table headers for other stats */}
              </TableRow>
            </TableHead>
            <TableBody>
              {playerStats.map((stat) => (
                <TableRow key={stat.id} className="bg-[#EDF1D6]">
                  <TableCell>{stat.player_name}</TableCell>
                  <TableCell>{stat.goals}</TableCell>
                  <TableCell>{stat.shots}</TableCell>
                  <TableCell>{stat.shots_on_target}</TableCell>
                  <TableCell>{stat.passes}</TableCell>
                  <TableCell>{stat.assists}</TableCell>
                  <TableCell>{stat.tackles}</TableCell>
                  {/* Add more table cells for other stats */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </PageContent>
  );
};

export default FixtureDetailPage;
