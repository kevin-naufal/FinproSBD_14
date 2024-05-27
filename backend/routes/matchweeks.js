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

export default router;