import express from 'express';
import bcrypt from 'bcrypt';
import pool from '../db.js'; // Import pool from db.js

const router = express.Router();

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

        // Insert into login_sessions table
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
