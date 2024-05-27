import express from 'express';
import bcrypt from 'bcrypt';
import pool from '../db.js'; // Import pool from db.js

const router = express.Router();

// Sign-up route
router.post('/', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert the new user into the database
    await pool.query('INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3)', [username, email, hashedPassword]);

    // Return success message
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error signing up:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
