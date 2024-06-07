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
    club_id INT REFERENCES clubs(id),
    fixture_id INT REFERENCES fixtures(id),
    player_id INT REFERENCES players(id)
);

CREATE TABLE bench (
    id SERIAL PRIMARY KEY,
    club_id INT REFERENCES clubs(id),
    fixture_id INT REFERENCES fixtures(id),
    player_id INT REFERENCES players(id)
);

CREATE TABLE listed_players (
    id SERIAL PRIMARY KEY,
    club_id INT REFERENCES clubs(id),
    fixture_id INT REFERENCES fixtures(id),
    player_id INT REFERENCES players(id)
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
    league_id INT REFERENCES leagues(id),
    matchweek_id INT REFERENCES matchweeks(id),
    referee_id INT REFERENCES referees(id),
    home_score INT,
    away_score INT
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

CREATE TABLE player_stats (
    id SERIAL PRIMARY KEY,
    fixture_id INT REFERENCES fixtures(id),
    club_id INT REFERENCES clubs(id),
    player_id INT REFERENCES players(id),
    shots INT,
    shots_on_target INT,
    passes INT,
    goals INT,
    assists INT,
    tackles INT,
    interceptions INT,
    saves INT,
    fouls_committed INT,
    corners INT,
    offsides INT,
    yellow_cards INT,
    red_cards INT,
    ratings DECIMAL(3, 2) -- Column for player ratings
);

CREATE TABLE transfers (
    id SERIAL PRIMARY KEY,
    player_id INT REFERENCES players(id),
    left_club INT REFERENCES clubs(id),
    joined_club INT REFERENCES clubs(id),
    fee INT
);
CONSTRAINT unique_name UNIQUE (name);

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
