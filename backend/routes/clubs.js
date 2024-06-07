// routes/clubs.js
import express from 'express';
import pool from '../db.js'; // Import pool from db.js

const router = express.Router();

// Get clubs by name
router.get('/search', async (req, res) => {
  const { term } = req.query;

  try {
    // Use ILIKE for case-insensitive search
    const query = `
      SELECT * FROM clubs
      WHERE name ILIKE $1;
    `;

    const values = [`%${term}%`];
    const result = await pool.query(query, values);

    // Always return a 200 status code with the result, even if it's empty
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error searching clubs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Get all clubs
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        c.id,
        c.name,
        c.manager,
        c.stadium,
        l.name AS league_name,
        l.country AS league_country
      FROM
        clubs c
      JOIN
        leagues l ON c.league_id = l.id
      ORDER BY id
    `);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching clubs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a single club by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
      // Fetch club details
      const clubResult = await pool.query(`
          SELECT 
              c.id, 
              c.name, 
              c.manager, 
              c.stadium,
              c.league_id,
              l.name AS league_name, 
              l.country AS league_country
          FROM 
              clubs c
          JOIN 
              leagues l ON c.league_id = l.id
          WHERE 
              c.id = $1
      `, [id]);

      // Fetch standings data for the club's league
      const standingsResult = await pool.query(`
          WITH RankedStandings AS (
              SELECT 
                  standings.id,
                  clubs.name AS club_name,
                  standings.league_id,
                  ROW_NUMBER() OVER (ORDER BY standings.points DESC, standings.goal_difference DESC, clubs.name) AS rank,
                  standings.games_played,
                  standings.wins,
                  standings.losses,
                  standings.draws,
                  standings.goal_difference,
                  standings.points
              FROM 
                  standings
              JOIN 
                  clubs ON standings.club_id = clubs.id
              WHERE 
                  standings.league_id = (SELECT league_id FROM clubs WHERE id = $1)
              ORDER BY 
                  standings.points DESC, standings.goal_difference DESC, clubs.name
          )
          SELECT 
              id,
              club_name,
              league_id,
              rank,
              games_played,
              wins,
              losses,
              draws,
              goal_difference,
              points
          FROM 
              RankedStandings;
      `, [id]);

      if (clubResult.rows.length === 0) {
          return res.status(404).json({ error: 'Club not found' });
      }

      const club = clubResult.rows[0];
      const standings = standingsResult.rows;

      res.status(200).json({ club, standings });
  } catch (error) {
      console.error('Error fetching club and standings:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});


// Add a new club
router.post('/', async (req, res) => {
  const { league_id, name, manager, stadium } = req.body;
  try {
    await pool.query(
      'INSERT INTO clubs (league_id, name, manager, stadium) VALUES ($1, $2, $3, $4) RETURNING *',
      [league_id, name, manager]
    );
    res.status(201).json({ message: 'Club added successfully' });
  } catch (error) {
    console.error('Error adding club:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update an existing club
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { updates } = req.body;

  try {
    const allowedColumns = ['league_id', 'name', 'manager', 'stadium'];

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

    const updateQuery = `UPDATE clubs SET ${updateFields.join(', ')} WHERE id = $${
      updateValues.length + 1
    } RETURNING *`;
    updateValues.push(id);

    const { rows } = await pool.query(updateQuery, updateValues);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Club not found' });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Error updating club:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get clubs by league ID
router.get('/by-league/:league_id', async (req, res) => {
  const { league_id } = req.params;
  try {
    const result = await pool.query('SELECT id, name FROM clubs WHERE league_id = $1', [league_id]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching clubs by league ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a club
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM clubs WHERE id = $1', [id]);
    res.status(200).json({ message: 'Club deleted successfully' });
  } catch (error) {
    console.error('Error deleting club:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
