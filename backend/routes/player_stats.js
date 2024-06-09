import express from 'express';
import pool from '../db.js';

const router = express.Router();

// GET all player stats
router.get('/', async (req, res) => {
  try {
    const playerStats = await pool.query('SELECT * FROM player_stats');
    res.json({
      message: 'Player stats data fetched successfully',
      data: playerStats.rows
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.patch('/fixtures/:fixture_id/scores', async (req, res) => {
  const { fixture_id } = req.params;
  const { home_score, away_score } = req.body;

  try {
    // Update the scores in the database
    const queryResult = await pool.query(
      'UPDATE fixtures SET home_score = $1, away_score = $2 WHERE id = $3 RETURNING *',
      [home_score, away_score, fixture_id]
    );

    // Check if the fixture exists and was updated
    if (queryResult.rowCount === 0) {
      return res.status(404).json({ error: 'Fixture not found' });
    }

    // Return the updated fixture
    res.json(queryResult.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET player stats by fixture_id
router.get('/:fixture_id', async (req, res) => {
  try {
    const { fixture_id } = req.params;
    const playerStats = await pool.query('SELECT * FROM player_stats WHERE fixture_id = $1', [fixture_id]);
    res.json({
      message: 'Player stats data fetched successfully',
      data: playerStats.rows
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// POST new player stats
router.post('/', async (req, res) => {
  const {
    fixture_id,
    club_id,
    player_id,
    shots,
    shots_on_target,
    passes,
    goals,
    assists,
    tackles,
    interceptions,
    saves,
    fouls_committed,
    corners,
    offsides,
    yellow_cards,
    red_cards,
    ratings
  } = req.body;

  try {
    const newPlayerStats = await pool.query(
      'INSERT INTO player_stats (fixture_id, club_id, player_id, shots, shots_on_target, passes, goals, assists, tackles, interceptions, saves, fouls_committed, corners, offsides, yellow_cards, red_cards, ratings) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING *',
      [
        fixture_id,
        club_id,
        player_id,
        shots,
        shots_on_target,
        passes,
        goals,
        assists,
        tackles,
        interceptions,
        saves,
        fouls_committed,
        corners,
        offsides,
        yellow_cards,
        red_cards,
        ratings
      ]
    );

    res.status(201).json({
      message: 'New player stats added successfully',
      data: newPlayerStats.rows[0]
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// GET player stats by fixture ID
router.get('/fixture/:fixture_id', async (req, res) => {
  const { fixture_id } = req.params;

  try {
    const playerStats = await pool.query(`
      SELECT 
        player_stats.id,
        player_stats.fixture_id,
        clubs.name AS club_name,
        players.name AS player_name,
        player_stats.shots,
        player_stats.shots_on_target,
        player_stats.passes,
        player_stats.goals,
        player_stats.assists,
        player_stats.tackles,
        player_stats.interceptions,
        player_stats.saves,
        player_stats.fouls_committed,
        player_stats.corners,
        player_stats.offsides,
        player_stats.yellow_cards,
        player_stats.red_cards,
        player_stats.ratings
      FROM 
        player_stats
      JOIN 
        clubs ON player_stats.club_id = clubs.id
      JOIN 
        players ON player_stats.player_id = players.id
      WHERE 
        player_stats.fixture_id = $1
    `, [fixture_id]);

    if (playerStats.rows.length === 0) {
      return res.status(404).json({ message: 'Player stats not found for this fixture ID' });
    }

    res.json({
      message: 'Player stats data fetched successfully',
      data: playerStats.rows
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Adjust the route to accept two parameters: fixture_id and club_id
router.get('/fixture/:fixture_id/stats/:club_id', async (req, res) => {
  const { fixture_id, club_id } = req.params;

  try {
    const queryResult = await pool.query(`
      SELECT 
        clubs.id AS club_id,
        clubs.name AS club_name,
        SUM(player_stats.shots) AS total_shots,
        SUM(player_stats.shots_on_target) AS total_shots_on_target,
        SUM(player_stats.passes) AS total_passes,
        SUM(player_stats.goals) AS total_goals,
        SUM(player_stats.assists) AS total_assists,
        SUM(player_stats.tackles) AS total_tackles,
        SUM(player_stats.interceptions) AS total_interceptions,
        SUM(player_stats.saves) AS total_saves,
        SUM(player_stats.fouls_committed) AS total_fouls_committed,
        SUM(player_stats.corners) AS total_corners,
        SUM(player_stats.offsides) AS total_offsides,
        SUM(player_stats.yellow_cards) AS total_yellow_cards,
        SUM(player_stats.red_cards) AS total_red_cards,
        AVG(player_stats.ratings) AS average_ratings
      FROM 
        player_stats
      JOIN 
        clubs ON player_stats.club_id = clubs.id
      WHERE 
        player_stats.fixture_id = $1 AND player_stats.club_id = $2
      GROUP BY 
        clubs.id, clubs.name;
    `, [fixture_id, club_id]);

    res.json(queryResult.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});




router.delete('/fixture/:fixture_id', async (req, res) => {
  const { fixture_id } = req.params;

  try {
    // Delete player stats for the provided fixture ID
    const deletedStats = await pool.query('DELETE FROM player_stats WHERE fixture_id = $1 RETURNING *', [fixture_id]);

    // Check if any player stats were deleted
    if (deletedStats.rowCount === 0) {
      // If no player stats were deleted, return a success response with a message
      return res.status(200).json({ message: 'No player stats found for this fixture ID' });
    }

    // If player stats were deleted, return a success response with a message
    res.status(200).json({ message: 'Player stats data deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});



// Add more routes for updating and deleting player stats...

export default router;
