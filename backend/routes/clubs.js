// routes/clubs.js
import express from 'express';
import pool from '../db.js'; // Import pool from db.js

const router = express.Router();

// Get all clubs
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM clubs');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching clubs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a single club by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const result = await pool.query(`
        SELECT 
          c.id, 
          c.name, 
          c.manager, 
          c.stadium, 
          l.name AS league_name, 
          l.country AS league_country
        FROM clubs c
        JOIN leagues l ON c.league_id = l.id
        WHERE c.id = $1
      `, [id]);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Club not found' });
      }
      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error('Error fetching club:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

// Add a new club
router.post('/', async (req, res) => {
  const { league_id, name, manager, stadium } = req.body;
  try {
    await pool.query(
      'INSERT INTO clubs (league_id, name, manager, stadium) VALUES ($1, $2, $3, $4)',
      [league_id, name, manager, stadium]
    );
    res.status(201).json({ message: 'Club added successfully' });
  } catch (error) {
    console.error('Error adding club:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update an existing club
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { league_id, name, manager, stadium } = req.body;
  try {
    await pool.query(
      'UPDATE clubs SET league_id = $1, name = $2, manager = $3, stadium = $4 WHERE id = $5',
      [league_id, name, manager, stadium, id]
    );
    res.status(200).json({ message: 'Club updated successfully' });
  } catch (error) {
    console.error('Error updating club:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a club
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM clubs WHERE id = $1', [id]);
    res.status(200).json({ message: 'Club deleted successfully' });
  } catch (error) {
    console.error('Error deleting club:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;