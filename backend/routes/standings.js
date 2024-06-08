// routes/standings.js
import express from 'express';
import pool from '../db.js';

const router = express.Router();

// Create a new standing
router.post('/', async (req, res) => {
  const { club_id, league_id, rank, games_played, wins, losses, draws, goal_difference, points } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO standings (club_id, league_id, rank, games_played, wins, losses, draws, goal_difference, points) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
       RETURNING *`,
      [club_id, league_id, rank, games_played, wins, losses, draws, goal_difference, points]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating standing:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all standings
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM standings');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error getting standings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get standings by league_id
router.get('/:league_id', async (req, res) => {
  const { league_id } = req.params;

  try {
    const result = await pool.query(`
      WITH RankedStandings AS (
              SELECT 
                  standings.id,
                  clubs.name AS club_name,
                  standings.league_id,
                  ROW_NUMBER() OVER (ORDER BY standings.points DESC, standings.goal_difference DESC, clubs.name) AS rank,
                  standings.games_played,
                  standings.wins,
                  standings.losses,
                  standings.draws,
                  standings.goal_difference,
                  standings.points
              FROM 
                  standings
              JOIN 
                  clubs ON standings.club_id = clubs.id
              WHERE 
                  standings.league_id = $1
              ORDER BY 
                  standings.points DESC, standings.goal_difference DESC, clubs.name
          )
          SELECT 
              id,
              club_name,
              league_id,
              rank,
              games_played,
              wins,
              losses,
              draws,
              goal_difference,
              points
          FROM 
              RankedStandings;`, [league_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Standing not found' });
    }
    
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error getting standing:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.get('/club/:club_id', async (req, res) => {
  const { club_id } = req.params;

  try {
    const result = await pool.query('SELECT * FROM standings WHERE club_id = $1', [club_id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Standing not found' });
    }
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error getting standing:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Update a standing by ID
router.patch('/club/:club_id', async (req, res) => {
  const { club_id } = req.params;
  const { rank, games_played, wins, losses, draws, goal_difference, points } = req.body;

  try {
    const result = await pool.query(
      `UPDATE standings 
       SET games_played = $1, 
           wins = $2, 
           losses = $3, 
           draws = $4, 
           goal_difference = $5, 
           points = $6 
       WHERE club_id = $7 
       RETURNING *`,
      [games_played, wins, losses, draws, goal_difference, points, club_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Standing not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error updating standing:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Delete a standing by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM standings WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Standing not found' });
    }
    res.status(200).json({ message: 'Standing deleted successfully' });
  } catch (error) {
    console.error('Error deleting standing:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
