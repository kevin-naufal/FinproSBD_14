import express from 'express';
import pool from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM matchweeks');
      res.json({
        message: 'Matchweeks data fetched successfully',
        data: result.rows
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });

  router.get('/latest-matchweek', async (req, res) => {
    try {
      const result = await pool.query('SELECT MAX(matchweek_id) AS max_matchweek FROM fixtures');
      const maxMatchweek = result.rows[0].max_matchweek;
      res.json({ maxMatchweek });
    } catch (error) {
      console.error('Error fetching maximum matchweek:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

export default router;