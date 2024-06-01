import express from 'express';
import pool from '../db.js'; // Import pool from db.js

const router = express.Router();

// Fetch the latest inserted fixture id
router.get('/latest', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * 
      FROM fixtures 
      ORDER BY id DESC 
      LIMIT 1
    `);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No fixtures found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * from fixtures
    `);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all fixtures by matchweek
router.get('/matchweek/:matchweek', async (req, res) => {
  const { matchweek } = req.params;
  try {
    const result = await pool.query(`
      SELECT 
        fixtures.*, 
        home_clubs.name AS home_club_name, 
        away_clubs.name AS away_club_name,
        leagues.name AS league_name, 
        leagues.country AS league_country
      FROM fixtures
      JOIN clubs AS home_clubs ON fixtures.home_club_id = home_clubs.id
      JOIN clubs AS away_clubs ON fixtures.away_club_id = away_clubs.id
      JOIN leagues ON fixtures.league_id = leagues.id
      WHERE fixtures.matchweek_id = $1
    `, [matchweek]);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get a single fixture by id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM fixtures WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Fixture not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a new fixture
router.post('/', async (req, res) => {
  const { home_club_id, away_club_id, home_score, away_score, league_id, matchweek_id, referee_id } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO fixtures (home_club_id, away_club_id, home_score, away_score, league_id, matchweek_id, referee_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [home_club_id, away_club_id, home_score, away_score, league_id, matchweek_id, referee_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update a fixture
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { home_club_id, away_club_id, home_score, away_score, league_id, matchweek_id, referee_id } = req.body;
  try {
    const result = await pool.query(
      'UPDATE fixtures SET home_club_id = $1, away_club_id = $2, home_score = $3, away_score = $4, league_id = $5, matchweek_id = $6, referee_id = $7 WHERE id = $8 RETURNING *',
      [home_club_id, away_club_id, home_score, away_score, league_id, matchweek_id, referee_id, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Fixture not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a fixture
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM fixtures WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Fixture not found' });
    }
    res.status(200).json({ message: 'Fixture deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
