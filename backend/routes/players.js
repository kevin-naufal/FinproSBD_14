// routes/players.js
import express from 'express';
import pool from '../db.js';

const router = express.Router();

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
      SELECT listed_players.*, players.name AS player_name, clubs.name AS club_name, players.position AS player_position
      FROM listed_players
      JOIN players ON listed_players.player_id = players.id
      JOIN clubs ON listed_players.club_id = clubs.id
      WHERE listed_players.fixture_id = $1
      ORDER BY clubs.id, listed_players.id;
    `;
    const { rows } = await pool.query(selectQuery, [fixture_id]);

    // Send the fetched data as a response
    res.json(rows);
  } catch (error) {
    console.error('Error fetching listed players:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.get('/listed_players/starter/:fixture_id', async (req, res) => {
  const { fixture_id } = req.params;
  try {
    const selectQuery = `
      SELECT listed_players.*, players.name AS player_name, clubs.name AS club_name, players.position AS player_position
      FROM listed_players
      JOIN players ON listed_players.player_id = players.id
      JOIN clubs ON listed_players.club_id = clubs.id
      WHERE listed_players.fixture_id = $1
      ORDER BY listed_players.id
      LIMIT 22;
    `;
    const { rows } = await pool.query(selectQuery, [fixture_id]);

    // Send the fetched data as a response
    res.json(rows);
  } catch (error) {
    console.error('Error fetching listed players:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



router.get('/listed_players/bench/:fixture_id', async (req, res) => {
  const { fixture_id } = req.params;

  try {
    // Fetch total rows count for a specific fixture and club
    const rowCountResult = await pool.query('SELECT COUNT(*) FROM listed_players WHERE fixture_id = $1', [fixture_id]);
    const totalRows = parseInt(rowCountResult.rows[0].count);

    // Check if total rows is not equal to 22
    if (totalRows != 22) {
      // Fetch players not in the starting lineup for a specific fixture and club
      const result = await pool.query(`
        SELECT listed_players.*, players.name AS player_name, clubs.name AS club_name, players.position AS player_position
        FROM listed_players
        JOIN players ON listed_players.player_id = players.id
        JOIN clubs ON listed_players.club_id = clubs.id
        WHERE listed_players.fixture_id = $1
        ORDER BY listed_players.id
        LIMIT 18;
      `, [fixture_id]);

      res.status(200).json(result.rows);
    } else {
      // Total rows is equal to 22, so do not perform the get query
      res.status(200).json({ message: "Total rows is equal to 22. No further action required." });
    }
  } catch (error) {
    console.error('Error fetching bench players:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



// DELETE route to remove the 22 listed players for a fixture
router.delete('/listed_players/starter/:fixture_id', async (req, res) => {
  const { fixture_id } = req.params;
  try {
    const deleteQuery = `
      DELETE FROM listed_players
      WHERE id IN (
        SELECT id
        FROM listed_players
        WHERE fixture_id = $1
        ORDER BY id
        LIMIT 22
      )
      RETURNING *;
    `;
    const { rows } = await pool.query(deleteQuery, [fixture_id]);

    // Send the deleted data as a response
    res.json({ message: 'Deleted 22 players', data: rows });
  } catch (error) {
    console.error('Error deleting listed players:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/listed_players/bench/:fixture_id', async (req, res) => {
  const { fixture_id } = req.params;
  try {
    // Count the total rows from listed_players
    const countQuery = `
      SELECT COUNT(*) AS total_rows
      FROM listed_players
      WHERE fixture_id = $1;
    `;
    const { rows: [{ total_rows }] } = await pool.query(countQuery, [fixture_id]);

    // If total rows is 40, delete 18 players
    if (total_rows == 40) {
      const deleteQuery = `
        DELETE FROM listed_players
        WHERE id IN (
          SELECT id
          FROM listed_players
          WHERE fixture_id = $1
          ORDER BY id
          LIMIT 18
        )
        RETURNING *;
      `;
      const { rows } = await pool.query(deleteQuery, [fixture_id]);

      // Send the deleted data as a response
      res.json({ message: 'Deleted 18 players', data: rows });
    } else if (total_rows == 22) {
      // If total rows is 22, do nothing
      res.json({ message: 'No players deleted. Total rows is 22' });
    } else if (total_rows == 0) {
      // If total rows is 0, do nothing
      res.json({ message: 'No players to delete. Total rows is 0' });
    } else {
      // If total rows is neither 40 nor 22 nor 0, return an error
      res.status(400).json({ error: 'Invalid total row count. Expected 40, 22, or 0' });
    }
  } catch (error) {
    console.error('Error deleting listed players:', error);
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


router.get('/unusedInStartingLineup/:clubId/:fixtureId', async (req, res) => {
  const { clubId, fixtureId } = req.params;
  console.log('fixtureId:', fixtureId);
  console.log('clubId:', clubId);

  try {
    // Check if there are already 22 players in the starting lineup
    const rowCountResult = await pool.query(`
      SELECT COUNT(*) AS row_count
      FROM listed_players
      WHERE fixture_id = $1
    `, [fixtureId]);

    const rowCount = rowCountResult.rows[0].row_count;
    console.log('rowCount:', rowCount); // Log the rowCount

    if (rowCount == 40) {
      console.log('Fetching unused players starting from the 23rd record onward...');
      // If there are already 40 players, fetch unused players starting from the 23rd record onward
      const result = await pool.query(`
        SELECT p.id, p.name, p.position 
        FROM players p 
        LEFT JOIN (
          SELECT * FROM listed_players WHERE fixture_id = $1 AND club_id = $2
          ORDER BY id LIMIT ALL OFFSET 11
        ) sl ON p.id = sl.player_id
        WHERE sl.id IS NULL AND p.club_id = $2;
      `, [fixtureId, clubId]);
      res.status(200).json(result.rows);
    } else if (rowCount == 22) {
      console.log('Fetching unused players normally...');
      // If there are less than 22 players, fetch unused players using the previous query
      const result = await pool.query(`
        SELECT p.id, p.name, p.position 
        FROM players p 
        LEFT JOIN listed_players sl ON p.id = sl.player_id AND sl.fixture_id = $1 AND sl.club_id = $2
        WHERE sl.id IS NULL AND p.club_id = $2;
      `, [fixtureId, clubId]);
      res.status(200).json(result.rows);
    } else {
      console.log('Unexpected rowCount:', rowCount);
      // If rowCount is unexpected, return a server error
      res.status(500).json({ error: 'Unexpected server error' });
    }
  } catch (error) {
    console.error('Error fetching players not used in starting lineup for club and fixture:', error);
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
  const { updates } = req.body;

  try {
    if (!updates) {
      return res.status(400).json({ error: 'No updates provided' });
    }

    const allowedColumns = ['name', 'club_id', 'height', 'shirt_number', 'age', 'date_of_birth', 'preferred_foot', 'country', 'position', 'market_value'];

    const updateFields = [];
    const updateValues = [];

    for (const [column, value] of Object.entries(updates)) {
      if (!allowedColumns.includes(column)) {
        return res.status(400).json({ error: `Invalid column to update: ${column}` });
      }

      updateFields.push(`${column} = $${updateValues.length + 1}`);
      updateValues.push(value);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    const updateQuery = `UPDATE players SET ${updateFields.join(', ')} WHERE id = $${
      updateValues.length + 1
    } RETURNING *`;
    updateValues.push(id);

    const { rows } = await pool.query(updateQuery, updateValues);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Player not found' });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Error updating player:', error);
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
