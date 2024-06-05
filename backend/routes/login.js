import express from 'express';
import bcrypt from 'bcrypt';
import pool from '../db.js'; // Import pool from db.js

const router = express.Router();

router.get('/latest-login-session', async (req, res) => {
  try {
    // Query the database to retrieve the latest user_id from login_sessions table
    const latestUserResult = await pool.query('SELECT * FROM login_sessions ORDER BY id DESC LIMIT 1');

    // Check if any login session is found
    if (latestUserResult.rows.length === 1) {
      const latestUserId = latestUserResult.rows[0].user_id;

      // Query the database to retrieve login session information by latest user_id
      const result = await pool.query('SELECT * FROM login_sessions WHERE user_id = $1', [latestUserId]);

      // Check if login session is found
      if (result.rows.length > 0) {
        res.status(200).json(result.rows);
      } else {
        // Login session not found
        res.status(404).json({ error: 'Login session not found' });
      }
    } else {
      // No login session found
      res.status(404).json({ error: 'No login session found' });
    }
  } catch (error) {
    console.error('Error retrieving latest login session:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/logout', async (req, res) => {
  try {
    // Retrieve the latest user_id from login_sessions table
    const latestUserResult = await pool.query('SELECT user_id FROM login_sessions ORDER BY id DESC LIMIT 1');

    // Check if any login session is found
    if (latestUserResult.rows.length === 1) {
      const latestUserId = latestUserResult.rows[0].user_id;

      // Update is_logged_in to false for the latest user_id
      await pool.query('UPDATE login_sessions SET is_logged_in = $1 WHERE user_id = $2', [false, latestUserId]);

      res.status(200).json({ message: 'Logout successful' });
    } else {
      // No login session found
      res.status(404).json({ error: 'No login session found' });
    }
  } catch (error) {
    console.error('Error logging out:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login route
router.post('/', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Query the database to retrieve user information
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

    // If user is found, verify password
    if (result.rows.length === 1) {
      const user = result.rows[0];
      const passwordMatch = await bcrypt.compare(password, user.password_hash);
      if (passwordMatch) {
        // Passwords match, login successful

        // Check if the user already has a login session
        const sessionResult = await pool.query('SELECT * FROM login_sessions WHERE user_id = $1', [user.id]);

        if (sessionResult.rows.length === 1) {
          // User session exists, delete the existing session
          await pool.query('DELETE FROM login_sessions WHERE user_id = $1', [user.id]);
        }

        // Insert a new session
        await pool.query('INSERT INTO login_sessions (user_id, is_logged_in, last_login) VALUES ($1, $2, $3)', [user.id, true, new Date()]);

        res.status(200).json({ message: 'Login successful' });
      } else {
        // Passwords do not match, login failed
        res.status(401).json({ error: 'Invalid username or password' });
      }
    } else {
      // User not found, login failed
      res.status(401).json({ error: 'Invalid username or password' });
    }
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


export default router;
