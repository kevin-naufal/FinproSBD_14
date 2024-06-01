// routes/bench.js
import express from 'express';
import pool from '../db.js'; // Import pool from db.js

const router = express.Router();

router.get('/', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM bench');
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error getting leagues:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  

// Get all players on bench by fixture id
router.get('/fixture/:fixture_id', async (req, res) => {
  const { fixture_id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM bench WHERE fixture_id = $1', [fixture_id]);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add a player to the bench
router.post('/', async (req, res) => {
  const { club_id, fixture_id, player_id } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO bench (club_id, fixture_id, player_id) VALUES ($1, $2, $3) RETURNING *',
      [club_id, fixture_id, player_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
