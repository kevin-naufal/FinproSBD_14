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
    const result = await pool.query('SELECT * FROM clubs');
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
          SELECT 
              s.id,
              s.league_id,
              c.name AS club_name,
              s.rank,
              s.games_played,
              s.wins,
              s.losses,
              s.draws,
              s.goal_difference,
              s.points
          FROM 
              standings s
          JOIN 
              clubs c ON s.club_id = c.id
          WHERE 
              c.league_id = (SELECT league_id FROM clubs WHERE id = $1)
          ORDER BY 
              s.rank ASC
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
  const { league_id, name, manager, stadium } = req.body;
  try {
    await pool.query(
      'UPDATE clubs SET league_id = $1, name = $2, manager = $3, stadium = $4 WHERE id = $5',
      [league_id, name, manager, stadium, id]
    );
    res.status(200).json({ message: 'Club updated successfully' });
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
