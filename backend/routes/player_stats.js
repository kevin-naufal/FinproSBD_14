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

// Add more routes for updating and deleting player stats...

export default router;
