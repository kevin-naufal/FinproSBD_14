
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { PageContent } from "../Header";
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
const LeagueDetailPage = () => {
  const [standings, setStandings] = useState([]);
  const { league_id } = useParams();

  useEffect(() => {
    const fetchStandings = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/standings/${league_id}`
        );
        setStandings(response.data);
      } catch (error) {
        console.error("Error fetching standings:", error);
      }
    };

    fetchStandings();
  }, [league_id]);

  if (standings.length === 0) {
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
        <Typography variant="h4" component="h1" className="standings-title">
          League Standings
        </Typography>
        <TableContainer
          component={Paper}
          className="standings-table border-2 border-black"
        >
          <Table>
            <TableHead>
              <TableRow className="bg-[#9DC08B]">
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
                <TableRow key={standing.id} className="bg-[#EDF1D6]">
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

export default LeagueDetailPage;
