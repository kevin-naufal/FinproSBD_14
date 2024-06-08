import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import pg from 'pg';
import fixturesRoutes from './routes/fixtures.js';
import playersRoutes from './routes/players.js';
import matchweeksRoutes from './routes/matchweeks.js';
import loginRoutes from './routes/login.js';
import signupRoutes from './routes/signup.js';
import transfersRoutes from './routes/transfers.js';
import clubsRoutes from './routes/clubs.js'; // Import clubs routes
import leaguesRoutes from './routes/leagues.js';
import standingsRoutes from './routes/standings.js';
import starterRoutes from './routes/starter.js';
import benchRoutes from './routes/bench.js';
import playerStatsRoutes from './routes/player_stats.js';
import fantasyfcRoutes from './routes/fantasyfc.js';

config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL pool setup
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

// Database connection check
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error acquiring client:', err.stack);
    return;
  }
  console.log('Connected to the database');
  release();
});

// Middleware to provide pool to routes
const providePool = (req, res, next) => {
  req.pool = pool;
  next();
};

// Routes
app.use('/api/fixtures', providePool, fixturesRoutes);
app.use('/api/players', providePool, playersRoutes);
app.use('/api/matchweeks', providePool, matchweeksRoutes);
app.use('/api/login', providePool, loginRoutes);
app.use('/api/signup', providePool, signupRoutes);
app.use('/api/transfers', providePool, transfersRoutes);
app.use('/api/clubs', providePool, clubsRoutes); // Use clubs routes
app.use('/api/leagues', providePool, leaguesRoutes);
app.use('/api/standings', providePool, standingsRoutes);
app.use('/api/starter', providePool, starterRoutes);
app.use('/api/bench', providePool, benchRoutes);
app.use('/api/playerStats', providePool, playerStatsRoutes);
app.use('/api/fantasyfc', providePool, fantasyfcRoutes);
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
