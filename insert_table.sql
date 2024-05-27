INSERT INTO leagues (name, country) VALUES
    ('Premier League', 'England'),
    ('Serie A', 'Italy'),
    ('Bundesliga', 'Germany'),
    ('Ligue 1', 'France'),
    ('La Liga', 'Spain');

INSERT INTO matchweeks (week_number) VALUES
    (1),
    (2),
    (3);


-- Step 1: Add a new temporary column
ALTER TABLE players_dummy ADD COLUMN market_value_int INTEGER;

UPDATE players_dummy
SET market_value_int = CASE
    WHEN market_value IS NULL OR market_value = 'NULL' THEN NULL
    WHEN market_value::TEXT LIKE '%M' THEN REPLACE(REPLACE(market_value::TEXT, '?', ''), 'M', '')::NUMERIC * 1000000
    WHEN market_value::TEXT LIKE '%K' THEN REPLACE(REPLACE(market_value::TEXT, '?', ''), 'K', '')::NUMERIC * 1000
    ELSE REPLACE(market_value::TEXT, '?', '')::NUMERIC
  END;


-- Step 3: Drop the old column
ALTER TABLE players DROP COLUMN market_value;

-- Step 4: Rename the new column to market_value
ALTER TABLE players RENAME COLUMN market_value_int TO market_value;

('Cheick Doumbia', 85, 165.00, 24, 19, '2004-10-18', 'NULL', 'France', 'NULL', 'Defender');

SELECT *
FROM players
ORDER BY market_value DESC
LIMIT 1;

SELECT *
FROM players
ORDER BY CASE WHEN market_value IS NULL THEN 1 ELSE 0 END, market_value DESC NULLS LAST;

INSERT INTO fixtures (home_club_id, away_club_id, home_score, away_score, league_id, matchweek_id, match_date, stadium, referee) VALUES 
(21, 36, 3, 2, 1, 1, '2024-08-24', 'Emirates Stadium', 'Michael Oliver'),
(60, 50, 2, 1, 3, 1, '2024-08-24', 'Allianz Arena', 'Felix Brych');

INSERT INTO referees (name, nationality) VALUES
('Howard Webb', 'England'),
('Pierluigi Collina', 'Italy'),
('Mark Clattenburg', 'England'),
('Bjorn Kuipers', 'Netherlands'),
('Felix Brych', 'Germany'),
('Damir Skomina', 'Slovenia'),
('Cuneyt Çakır', 'Turkey'),
('Nestor Pitana', 'Argentina'),
('Wilmar Roldan', 'Colombia'),
('Antonio Mateu Lahoz', 'Spain'),
('Michael Oliver', 'England'),
('Daniele Orsato', 'Italy'),
('Gianluca Rocchi', 'Italy'),
('Andres Cunha', 'Uruguay'),
('Viktor Kassai', 'Hungary');

UPDATE clubs
SET stadium = 'St James Park'
WHERE name = 'Newcastle United';

UPDATE clubs
SET stadium = 'City Ground'
WHERE name = 'Nottingham Forest';

UPDATE clubs
SET stadium = 'Bramall Lane'
WHERE name = 'Sheffield United';

UPDATE clubs
SET stadium = 'Tottenham Hotspur Stadium'
WHERE name = 'Tottenham Hotspur';

UPDATE clubs
SET stadium = 'London Stadium'
WHERE name = 'West Ham United';

UPDATE clubs
SET stadium = 'Molineux Stadium'
WHERE name = 'Wolverhampton Wanderers';

UPDATE clubs
SET stadium = 'Stadio Atleti Azzurri dItalia'
WHERE name = 'Atalanta';

UPDATE clubs
SET stadium = 'Stadio Renato Dall Ara'
WHERE name = 'Bologna';

SELECT *
FROM players
WHERE name LIKE '%Nunes%';



INSERT INTO transfers (player_id, left_club, joined_club, fee)
SELECT p.id AS player_id, lc.id AS left_club, jc.id AS joined_club, 55000000 AS fee
FROM players p
JOIN clubs lc ON lc.name LIKE '%Leverkusen%'
JOIN clubs jc ON jc.name LIKE '%Aston Villa%'
WHERE p.name LIKE '%Diaby%';

INSERT INTO standings (club_id, league_id, rank, games_played, wins, losses, draws, goal_difference, points) VALUES
    (78, 4, 1, 38, 29, 1, 8, 61, 95), -- Real Madrid
    (67, 4, 2, 37, 25, 5, 7, 34, 82), -- Barcelona
    (71, 4, 3, 38, 25, 7, 6, 39, 81), -- Girona
    (66, 4, 4, 38, 24, 10, 4, 27, 76), -- Atletico Madrid
    (65, 4, 5, 38, 19, 8, 11, 24, 68), -- Athletic Club
    (79, 4, 6, 38, 16, 10, 12, 12, 60), -- Real Sociedad
    (77, 4, 7, 38, 14, 9, 15, 3, 57), -- Real Betis
    (82, 4, 8, 38, 14, 13, 11, 0, 53), -- Villarreal
    (81, 4, 9, 38, 13, 15, 10, -5, 49), -- Valencia
    (64, 4, 10, 38, 13, 16, 9, -9, 48), -- Deportivo Alaves
    (75, 4, 11, 38, 12, 17, 9, -11, 45), -- Osasuna
    (70, 4, 12, 38, 10, 15, 13, -12, 43), -- Getafe
    (69, 4, 13, 38, 10, 17, 11, -11, 41), -- Celta Vigo
    (80, 4, 14, 37, 10, 16, 11, -5, 41), -- Sevilla
    (74, 4, 15, 38, 8, 14, 16, -11, 40), -- Mallorca
    (73, 4, 16, 38, 10, 19, 9, -15, 39), -- Las Palmas
    (76, 4, 17, 38, 8, 16, 14, -19, 38), -- Rayo Vallecano
    (68, 4, 18, 38, 6, 17, 15, -29, 33), -- Cadiz
    (63, 4, 19, 38, 3, 23, 12, -32, 21), -- Almeria
    (72, 4, 20, 38, 4, 25, 9, -41, 21); -- Granada


CREATE VIEW standings_view AS
SELECT
    s.id,
    c.name AS club_name,
    l.name AS league_name,
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
JOIN
    leagues l ON s.league_id = l.id;


INSERT INTO standings (club_id, league_id, rank, games_played, wins, losses, draws, goal_difference, points)
VALUES
    (35, 1, 1, 38, 28, 7, 3, 62, 91),
    (21, 1, 2, 38, 28, 5, 5, 62, 89),
    (33, 1, 3, 38, 24, 10, 4, 45, 82),
    (22, 1, 4, 38, 20, 8, 10, 15, 68),
    (42, 1, 5, 38, 20, 6, 12, 13, 66),
    (27, 1, 6, 38, 18, 9, 11, 14, 63),
    (37, 1, 7, 38, 18, 6, 14, 23, 60),
    (36, 1, 8, 38, 18, 6, 14, -1, 60),
    (43, 1, 9, 38, 14, 10, 14, -14, 52),
    (28, 1, 10, 38, 13, 10, 15, -1, 49),
    (25, 1, 11, 38, 12, 12, 14, -7, 48),
    (23, 1, 12, 38, 13, 9, 16, -13, 48),
    (32, 1, 13, 38, 13, 8, 17, -6, 47),
    (44, 1, 14, 38, 13, 7, 18, -15, 46),
    (31, 1, 15, 38, 13, 9, 16, -11, 40),
    (24, 1, 16, 38, 10, 9, 19, -9, 39),
    (38, 1, 17, 38, 9, 9, 20, -18, 32),
    (34, 1, 18, 38, 6, 8, 24, -33, 26),
    (26, 1, 19, 38, 5, 9, 24, -37, 24),
    (40, 1, 20, 38, 3, 7, 28, -69, 16);

INSERT INTO standings (club_id, league_id, rank, games_played, wins, losses, draws, goal_difference, points)
VALUES
    (35, 1, 0, 0, 0, 0, 0, 0, 0),
    (21, 1, 0, 0, 0, 0, 0, 0, 0),
    (33, 1, 0, 0, 0, 0, 0, 0, 0),
    (22, 1, 0, 0, 0, 0, 0, 0, 0),
    (42, 1, 0, 0, 0, 0, 0, 0, 0),
    (27, 1, 0, 0, 0, 0, 0, 0, 0),
    (37, 1, 0, 0, 0, 0, 0, 0, 0),
    (36, 1, 0, 0, 0, 0, 0, 0, 0),
    (43, 1, 0, 0, 0, 0, 0, 0, 0),
    (28, 1, 0, 0, 0, 0, 0, 0, 0),
    (25, 1, 0, 0, 0, 0, 0, 0, 0),
    (23, 1, 0, 0, 0, 0, 0, 0, 0),
    (32, 1, 0, 0, 0, 0, 0, 0, 0),
    (44, 1, 0, 0, 0, 0, 0, 0, 0),
    (31, 1, 0, 0, 0, 0, 0, 0, 0),
    (24, 1, 0, 0, 0, 0, 0, 0, 0),
    (38, 1, 0, 0, 0, 0, 0, 0, 0),
    (34, 1, 0, 0, 0, 0, 0, 0, 0),
    (26, 1, 0, 0, 0, 0, 0, 0, 0),
    (40, 1, 0, 0, 0, 0, 0, 0, 0);


WITH ClubRank AS (
    SELECT club_id, 
           ROW_NUMBER() OVER (ORDER BY points DESC, goal_difference DESC, club_id) AS new_rank
    FROM standings
)
UPDATE standings AS s
SET rank = cr.new_rank
FROM ClubRank AS cr
WHERE s.club_id = cr.club_id;
