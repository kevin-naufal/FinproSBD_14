// routes/players.js
import express from 'express';
import pool from '../db.js';

const router = express.Router();

// Get all players
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM players');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching players:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a single player by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM players WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Player not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching player:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add a new player
router.post('/', async (req, res) => {
  const { name, club_id, height, shirt_number, age, date_of_birth, preferred_foot, country, market_value, position } = req.body;
  try {
    await pool.query(
      'INSERT INTO players (name, club_id, height, shirt_number, age, date_of_birth, preferred_foot, country, market_value, position) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
      [name, club_id, height, shirt_number, age, date_of_birth, preferred_foot, country, market_value, position]
    );
    res.status(201).json({ message: 'Player added successfully' });
  } catch (error) {
    console.error('Error adding player:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update an existing player
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, club_id, height, shirt_number, age, date_of_birth, preferred_foot, country, market_value, position } = req.body;
  try {
    await pool.query(
      'UPDATE players SET name = $1, club_id = $2, height = $3, shirt_number = $4, age = $5, date_of_birth = $6, preferred_foot = $7, country = $8, market_value = $9, position = $10 WHERE id = $11',
      [name, club_id, height, shirt_number, age, date_of_birth, preferred_foot, country, market_value, position, id]
    );
    res.status(200).json({ message: 'Player updated successfully' });
  } catch (error) {
    console.error('Error updating player:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a player
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM players WHERE id = $1', [id]);
    res.status(200).json({ message: 'Player deleted successfully' });
  } catch (error) {
    console.error('Error deleting player:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
