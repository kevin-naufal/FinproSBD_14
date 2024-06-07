// routes/starting_lineup.js
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

// Get all starting lineups by fixture id
router.get('/fixture/:fixture_id', async (req, res) => {
  const { fixture_id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM starting_lineup WHERE fixture_id = $1', [fixture_id]);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a new starting lineup
// Create a new starting lineup
router.post('/', async (req, res) => {
  const { club_id, fixture_id, player_ids } = req.body;
  try {
    const results = await Promise.all(player_ids.map(async (player_id) => {
      const result = await pool.query(
        'INSERT INTO starting_lineup (club_id, fixture_id, player_id) VALUES ($1, $2, $3) RETURNING *',
        [club_id, fixture_id, player_id]
      );
      return result.rows[0];
    }));

    // Check if any rows were inserted
    if (results.length === 0 || results.some(result => !result)) {
      // If no rows were inserted or if any of the results are falsy (indicating an error), send an error response
      res.status(400).json({ error: 'Failed to create starting lineup' });
    } else {
      // Otherwise, all inserts were successful, so send a success response
      res.status(201).json(results);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});


export default router;
