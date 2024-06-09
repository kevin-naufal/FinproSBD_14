import express from 'express';
import pool from '../db.js'; // Import pool from db.js

const router = express.Router();

// GET all fantasyfc entries
router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT
        f.id AS fantasyfc_id,
        f.user_id,
        f.player_id,
        p.name AS player_name,
        p.position AS player_position
      FROM
        fantasyfc f
      JOIN
        players p ON f.player_id = p.id
      ORDER BY
        p.position;
    `;

    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching fantasyfc data:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/playerdatabase', async (req, res) => {
  try {
    // Fetch the latest login session
    const latestLoginQuery = 'SELECT * FROM login_sessions ORDER BY id DESC LIMIT 1';
    const { rows: latestLoginRows } = await pool.query(latestLoginQuery);
    const latestLogin = latestLoginRows[0];

    // Check if a login session exists
    if (!latestLogin) {
      return res.status(404).json({ error: 'No login session found' });
    }

    // Check if the user is logged in
    if (!latestLogin.is_logged_in) {
      return res.status(403).json({ error: 'User is not logged in' });
    }

    // Fetch user data if logged in
    const userId = latestLogin.user_id;
    const userDataQuery = `
      SELECT
        f.id AS fantasyfc_id,
        f.user_id,
        f.player_id,
        p.name AS player_name,
        p.club_id AS club_id,
        p.position AS player_position
      FROM
        fantasyfc f
      JOIN
        players p ON f.player_id = p.id
      WHERE
        f.user_id = $1
      ORDER BY
        p.position;
    `;
    const { rows: userDataRows } = await pool.query(userDataQuery, [userId]);

    // Send the fetched user data as a response
    res.json(userDataRows);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'Internal server error' });
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

// In your PATCH API route handler
router.patch('/users/points', async (req, res) => {
  try {
    // Increment points for all users by 200
    const result = await pool.query('UPDATE users SET points = points + 200');
    
    // Log success message
    console.log('Points updated successfully:', result);
    
    // Respond with success message
    res.json({ message: 'Points updated successfully' });
  } catch (error) {
    console.error('Error updating points:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// PATCH (update) a fantasyfc entry by ID
router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { user_id, matchweek_id, player_id } = req.body;
  try {
    const { rows } = await pool.query(
      'UPDATE fantasyfc SET user_id = $1, matchweek_id = $2, player_id = $3 WHERE id = $4 RETURNING *',
      [user_id, matchweek_id, player_id, id]
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
