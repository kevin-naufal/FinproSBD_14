// routes/leagues.js
import express from 'express';
import pool from '../db.js';

const router = express.Router();

// Create a new league
router.post('/', async (req, res) => {
  const { name, country } = req.body;

  try {
    const result = await pool.query('INSERT INTO leagues (name, country) VALUES ($1, $2) RETURNING *', [name, country]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating league:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all leagues
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM leagues');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error getting leagues:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a single league by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('SELECT * FROM leagues WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'League not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error getting league:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a league by ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, country } = req.body;

  try {
    const result = await pool.query('UPDATE leagues SET name = $1, country = $2 WHERE id = $3 RETURNING *', [name, country, id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'League not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error updating league:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a league by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM leagues WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'League not found' });
    }
    res.status(200).json({ message: 'League deleted successfully' });
  } catch (error) {
    console.error('Error deleting league:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
