select * from fixtures;
select * from leagues;
select * from matchweeks;

CREATE TYPE player_position AS ENUM (
    'LW', 'LF', 'ST', 'CF', 'RW', 'RF', 'CAM', 'CM', 'RM', 'LM', 'CDM', 'LWB', 'LB', 'CB', 'RWB', 'RB', 'GK'
);

CREATE TABLE leagues (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL
);

CREATE TABLE matchweeks (
    id SERIAL PRIMARY KEY,
    week_number INT NOT NULL
);

CREATE TABLE starting_lineup (
    id SERIAL PRIMARY KEY,
    fixture_id INT REFERENCES fixtures(id),
    player_id INT REFERENCES players(id),
    player_rating NUMERIC(3, 1)
);

CREATE TABLE bench (
    id SERIAL PRIMARY KEY,
    fixture_id INT REFERENCES fixtures(id),
    player_id INT REFERENCES players(id),
    player_rating NUMERIC(3, 1)
);


CREATE TABLE standings (
    id SERIAL PRIMARY KEY,
    club_id INT NOT NULL REFERENCES clubs(id),
    league_id INT NOT NULL REFERENCES leagues(id),
    rank INT NOT NULL,
    games_played INT NOT NULL CHECK (games_played >= 0),
    wins INT NOT NULL CHECK (wins >= 0),
    losses INT NOT NULL CHECK (losses >= 0),
    draws INT NOT NULL CHECK (draws >= 0),
    goal_difference INT NOT NULL,
    points INT NOT NULL CHECK (points >= 0),
    UNIQUE (club_id, league_id)
);

CREATE TABLE fixtures (
    id SERIAL PRIMARY KEY,
    home_club_id INT REFERENCES clubs(id),
    away_club_id INT REFERENCES clubs(id),
    home_score INT,
    away_score INT,
    league_id INT REFERENCES leagues(id),
    matchweek_id INT REFERENCES matchweeks(id),
    match_date DATE,
    referee_id INT REFERENCES referees(id)
);


CREATE TABLE referees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    nationality VARCHAR(100)
);


CREATE TABLE clubs (
    id SERIAL PRIMARY KEY,
    league_id INT REFERENCES leagues(id),
    name VARCHAR(100) NOT NULL UNIQUE,
    manager VARCHAR(100),
    stadium VARCHAR(100)
);


CREATE TABLE fixture_stats (
    PRIMARY KEY (stat_name),
    fixture_id INT REFERENCES fixtures(id),
    stat_name VARCHAR(100) NOT NULL,
    home_value DECIMAL(10, 2),
    away_value DECIMAL(10, 2)
);

CREATE TABLE players (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    club_id INT REFERENCES clubs(id),
    height DECIMAL(5, 2),
    shirt_number INT,
    age INT,
    date_of_birth DATE,
    preferred_foot VARCHAR(20),
    country VARCHAR(100),
    market_value INT,
    position VARCHAR(100)
);

CREATE TABLE transfers (
    id SERIAL PRIMARY KEY,
    player_id INT REFERENCES players(id),
    left_club INT REFERENCES clubs(id),
    joined_club INT REFERENCES clubs(id),
    fee INT
);

ALTER TABLE players
ADD CONSTRAINT unique_name UNIQUE (name);

CREATE TABLE player_stats (
    PRIMARY KEY (stat_name),
    club_id INT REFERENCES clubs(id),
    stat_name VARCHAR(100) NOT NULL,
    stats DECIMAL(10, 2)
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE login_sessions (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    is_logged_in BOOLEAN DEFAULT FALSE,
    last_login TIMESTAMP
);
