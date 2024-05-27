import express from 'express';
import pool from '../db.js'; // Import pool from db.js

const router = express.Router();

// Get all transfers route
router.get('/', async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT 
          p.name AS player,
          p.age AS age,
          p.market_value AS market_value,
          p.country AS nationality,
          lc.name AS left,
          jc.name AS joined,
          t.fee AS fee
        FROM transfers t
        JOIN players p ON t.player_id = p.id
        JOIN clubs lc ON t.left_club = lc.id
        JOIN clubs jc ON t.joined_club = jc.id
      `);
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error fetching transfers:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  

// Add transfer route
router.post('/', async (req, res) => {
  const { player_id, left_club, joined_club, fee } = req.body;

  try {
    // Insert the new transfer into the database
    await pool.query('INSERT INTO transfers (player_id, left_club, joined_club, fee) VALUES ($1, $2, $3, $4)', [player_id, left_club, joined_club, fee]);

    // Return success message
    res.status(201).json({ message: 'Transfer added successfully' });
  } catch (error) {
    console.error('Error adding transfer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
