// routes/players.js
import express from 'express';
import pool from '../db.js';

const router = express.Router();

router.get('/search', async (req, res) => {
  const { term } = req.query;

  try {
    const selectQuery = `
      SELECT * FROM players 
      WHERE name ILIKE $1
      ORDER BY market_value IS NULL, market_value DESC;
    `;
    const { rows } = await pool.query(selectQuery, [`%${term}%`]);

    res.status(200).json(rows);
  } catch (error) {
    console.error('Error searching players:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all players
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM players');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching players:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/listed_players/:fixture_id', async (req, res) => {
  const { fixture_id } = req.params;
  try {
    const selectQuery = `
      SELECT listed_players.*, players.name AS player_name, clubs.name AS club_name
      FROM listed_players
      JOIN players ON listed_players.player_id = players.id
      JOIN clubs ON listed_players.club_id = clubs.id
      WHERE listed_players.fixture_id = $1
      ORDER BY listed_players.id
    `;
    const { rows } = await pool.query(selectQuery, [fixture_id]);

    // Send the fetched data as a response
    res.json(rows);
  } catch (error) {
    console.error('Error fetching listed players:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.post('/listed_players', async (req, res) => {
  const { club_id, fixture_id, player_id } = req.body; // Adjust fields as per your schema
  try {
    const insertQuery = `
      INSERT INTO listed_players (club_id, fixture_id, player_id)
      VALUES ($1, $2, $3)
    `;
    await pool.query(insertQuery, [club_id, fixture_id, player_id]);

    res.status(201).json({ message: 'Data inserted successfully' });
  } catch (error) {
    console.error('Error inserting data into listed_players:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Get players not used in the starting lineup for a specific club and fixture
router.get('/unusedInStartingLineup/:clubId/:fixtureId', async (req, res) => {
  const { clubId, fixtureId } = req.params;
  try {
    const result = await pool.query(`
      SELECT p.id, p.name, p.position 
      FROM players p 
      LEFT JOIN starting_lineup sl ON p.id = sl.player_id AND sl.fixture_id = $1
      WHERE sl.player_id IS NULL AND p.club_id = $2
    `, [fixtureId, clubId]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching players not used in starting lineup for club and fixture:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get players by club_id
router.get('/club/:club_id', async (req, res) => {
  const { club_id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM players WHERE club_id = $1', [club_id]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching players by club_id:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a single player by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM players WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Player not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching player:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add a new player
router.post('/', async (req, res) => {
  const { name, club_id, height, shirt_number, age, date_of_birth, preferred_foot, country, market_value, position } = req.body;
  try {
    await pool.query(
      'INSERT INTO players (name, club_id, height, shirt_number, age, date_of_birth, preferred_foot, country, market_value, position) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
      [name, club_id, height, shirt_number, age, date_of_birth, preferred_foot, country, market_value, position]
    );
    res.status(201).json({ message: 'Player added successfully' });
  } catch (error) {
    console.error('Error adding player:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update an existing player
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, club_id, height, shirt_number, age, date_of_birth, preferred_foot, country, market_value, position } = req.body;
  try {
    await pool.query(
      'UPDATE players SET name = $1, club_id = $2, height = $3, shirt_number = $4, age = $5, date_of_birth = $6, preferred_foot = $7, country = $8, market_value = $9, position = $10 WHERE id = $11',
      [name, club_id, height, shirt_number, age, date_of_birth, preferred_foot, country, market_value, position, id]
    );
    res.status(200).json({ message: 'Player updated successfully' });
  } catch (error) {
    console.error('Error updating player:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Define a route to create the temporary table and fetch data from it
router.get('/listed_players', async (req, res) => {
  try {
    // Create the temporary table listed_players
    const createTableQuery = `
      CREATE TEMP TABLE listed_players AS
      (
          SELECT * FROM starting_lineup
      )
      UNION ALL
      (
          SELECT * FROM bench
      );
    `;
    await pool.query(createTableQuery);

    // Fetch data from the temporary table
    const selectQuery = `
      SELECT * FROM listed_players;
    `;
    const { rows } = await pool.query(selectQuery);

    // Send the fetched data as a response
    res.json(rows);
  } catch (error) {
    console.error('Error fetching listed players:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a player
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM players WHERE id = $1', [id]);
    res.status(200).json({ message: 'Player deleted successfully' });
  } catch (error) {
    console.error('Error deleting player:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



export default router;
