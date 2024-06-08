import express from 'express';
import pool from '../db.js'; // Import pool from db.js

const router = express.Router();


router.get('/', async (req, res) => {
    try {
      const { rows } = await pool.query('SELECT * FROM fantasyfc');
      res.json(rows);
    } catch (error) {
      console.error('Error executing query', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  // POST a new fantasyfc entry
  router.post('/', async (req, res) => {
    const { user_id, player_id } = req.body;
    try {
      const { rows } = await pool.query(
        'INSERT INTO fantasyfc (user_id, player_id) VALUES ($1, $2) RETURNING *',
        [user_id, player_id]
      );
      res.status(201).json(rows[0]);
    } catch (error) {
      console.error('Error executing query', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  // PATCH (update) a fantasyfc entry by ID
  router.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const { user_id, player_id } = req.body;
    try {
      const { rows } = await pool.query(
        'UPDATE fantasyfc SET user_id = $1, player_id = $2 WHERE id = $3 RETURNING *',
        [user_id, player_id, id]
      );
      if (rows.length === 0) {
        return res.status(404).json({ error: 'FantasyFC entry not found' });
      }
      res.json(rows[0]);
    } catch (error) {
      console.error('Error executing query', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  export default router;