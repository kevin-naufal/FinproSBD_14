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
(21, 1, 0, 0, 0, 0, 0, 0, 0),
(22, 1, 0, 0, 0, 0, 0, 0, 0),
(23, 1, 0, 0, 0, 0, 0, 0, 0),
(24, 1, 0, 0, 0, 0, 0, 0, 0),
(25, 1, 0, 0, 0, 0, 0, 0, 0),
(26, 1, 0, 0, 0, 0, 0, 0, 0),
(27, 1, 0, 0, 0, 0, 0, 0, 0),
(28, 1, 0, 0, 0, 0, 0, 0, 0),
(31, 1, 0, 0, 0, 0, 0, 0, 0),
(32, 1, 0, 0, 0, 0, 0, 0, 0),
(33, 1, 0, 0, 0, 0, 0, 0, 0),
(34, 1, 0, 0, 0, 0, 0, 0, 0),
(35, 1, 0, 0, 0, 0, 0, 0, 0),
(36, 1, 0, 0, 0, 0, 0, 0, 0),
(37, 1, 0, 0, 0, 0, 0, 0, 0),
(38, 1, 0, 0, 0, 0, 0, 0, 0),
(40, 1, 0, 0, 0, 0, 0, 0, 0),
(42, 1, 0, 0, 0, 0, 0, 0, 0),
(43, 1, 0, 0, 0, 0, 0, 0, 0),
(44, 1, 0, 0, 0, 0, 0, 0, 0);

-- Insert for league_id = 2 for club_id = 1 - 20
INSERT INTO standings (club_id, league_id, rank, games_played, wins, losses, draws, goal_difference, points)
VALUES 
(1, 2, 0, 0, 0, 0, 0, 0, 0),
(2, 2, 0, 0, 0, 0, 0, 0, 0),
(3, 2, 0, 0, 0, 0, 0, 0, 0),
(4, 2, 0, 0, 0, 0, 0, 0, 0),
(5, 2, 0, 0, 0, 0, 0, 0, 0),
(6, 2, 0, 0, 0, 0, 0, 0, 0),
(7, 2, 0, 0, 0, 0, 0, 0, 0),
(8, 2, 0, 0, 0, 0, 0, 0, 0),
(9, 2, 0, 0, 0, 0, 0, 0, 0),
(10, 2, 0, 0, 0, 0, 0, 0, 0),
(11, 2, 0, 0, 0, 0, 0, 0, 0),
(12, 2, 0, 0, 0, 0, 0, 0, 0),
(13, 2, 0, 0, 0, 0, 0, 0, 0),
(14, 2, 0, 0, 0, 0, 0, 0, 0),
(15, 2, 0, 0, 0, 0, 0, 0, 0),
(16, 2, 0, 0, 0, 0, 0, 0, 0),
(17, 2, 0, 0, 0, 0, 0, 0, 0),
(18, 2, 0, 0, 0, 0, 0, 0, 0),
(19, 2, 0, 0, 0, 0, 0, 0, 0),
(20, 2, 0, 0, 0, 0, 0, 0, 0);

-- Insert for league_id = 3 for club_id = 45 - 62
INSERT INTO standings (club_id, league_id, rank, games_played, wins, losses, draws, goal_difference, points)
VALUES 
(45, 3, 0, 0, 0, 0, 0, 0, 0),
(46, 3, 0, 0, 0, 0, 0, 0, 0),
(47, 3, 0, 0, 0, 0, 0, 0, 0),
(48, 3, 0, 0, 0, 0, 0, 0, 0),
(49, 3, 0, 0, 0, 0, 0, 0, 0),
(50, 3, 0, 0, 0, 0, 0, 0, 0),
(51, 3, 0, 0, 0, 0, 0, 0, 0),
(52, 3, 0, 0, 0, 0, 0, 0, 0),
(53, 3, 0, 0, 0, 0, 0, 0, 0),
(54, 3, 0, 0, 0, 0, 0, 0, 0),
(55, 3, 0, 0, 0, 0, 0, 0, 0),
(56, 3, 0, 0, 0, 0, 0, 0, 0),
(57, 3, 0, 0, 0, 0, 0, 0, 0),
(58, 3, 0, 0, 0, 0, 0, 0, 0),
(59, 3, 0, 0, 0, 0, 0, 0, 0),
(60, 3, 0, 0, 0, 0, 0, 0, 0),
(61, 3, 0, 0, 0, 0, 0, 0, 0),
(62, 3, 0, 0, 0, 0, 0, 0, 0);

-- Insert for league_id = 4 for club_id = 63 - 82
INSERT INTO standings (club_id, league_id, rank, games_played, wins, losses, draws, goal_difference, points)
VALUES 
(63, 4, 0, 0, 0, 0, 0, 0, 0),
(64, 4, 0, 0, 0, 0, 0, 0, 0),
(65, 4, 0, 0, 0, 0, 0, 0, 0),
(66, 4, 0, 0, 0, 0, 0, 0, 0),
(67, 4, 0, 0, 0, 0, 0, 0, 0),
(68, 4, 0, 0, 0, 0, 0, 0, 0),
(69, 4, 0, 0, 0, 0, 0, 0, 0),
(70, 4, 0, 0, 0, 0, 0, 0, 0),
(71, 4, 0, 0, 0, 0, 0, 0, 0),
(72, 4, 0, 0, 0, 0, 0, 0, 0),
(73, 4, 0, 0, 0, 0, 0, 0, 0),
(74, 4, 0, 0, 0, 0, 0, 0, 0),
(75, 4, 0, 0, 0, 0, 0, 0, 0),
(76, 4, 0, 0, 0, 0, 0, 0, 0),
(77, 4, 0, 0, 0, 0, 0, 0, 0),
(78, 4, 0, 0, 0, 0, 0, 0, 0),
(79, 4, 0, 0, 0, 0, 0, 0, 0),
(80, 4, 0, 0, 0, 0, 0, 0, 0),
(81, 4, 0, 0, 0, 0, 0, 0, 0),
(82, 4, 0, 0, 0, 0, 0, 0, 0);

-- Insert for league_id = 5 for club_id = 83 - 100
INSERT INTO standings (club_id, league_id, rank, games_played, wins, losses, draws, goal_difference, points)
VALUES 
(83, 5, 0, 0, 0, 0, 0, 0, 0),
(84, 5, 0, 0, 0, 0, 0, 0, 0),
(85, 5, 0, 0, 0, 0, 0, 0, 0),
(86, 5, 0, 0, 0, 0, 0, 0, 0),
(87, 5, 0, 0, 0, 0, 0, 0, 0),
(88, 5, 0, 0, 0, 0, 0, 0, 0),
(89, 5, 0, 0, 0, 0, 0, 0, 0),
(90, 5, 0, 0, 0, 0, 0, 0, 0),
(91, 5, 0, 0, 0, 0, 0, 0, 0),
(92, 5, 0, 0, 0, 0, 0, 0, 0),
(93, 5, 0, 0, 0, 0, 0, 0, 0),
(94, 5, 0, 0, 0, 0, 0, 0, 0),
(95, 5, 0, 0, 0, 0, 0, 0, 0),
(96, 5, 0, 0, 0, 0, 0, 0, 0),
(97, 5, 0, 0, 0, 0, 0, 0, 0),
(98, 5, 0, 0, 0, 0, 0, 0, 0),
(99, 5, 0, 0, 0, 0, 0, 0, 0),
(100, 5, 0, 0, 0, 0, 0, 0, 0);

WITH ClubRank AS (
    SELECT club_id, 
           ROW_NUMBER() OVER (ORDER BY points DESC, goal_difference DESC, club_id) AS new_rank
    FROM standings
)
UPDATE standings AS s
SET rank = cr.new_rank
FROM ClubRank AS cr
WHERE s.club_id = cr.club_id;

CREATE OR REPLACE VIEW standings_view AS
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
ORDER BY
    s.rank ASC;

CREATE VIEW column_sums_view AS
SELECT
    'total'::text AS id,
    SUM(column1) AS column1_sum,
    SUM(column2) AS column2_sum,
    SUM(column3) AS column3_sum,
    SUM(column4) AS column4_sum,
    SUM(column5) AS column5_sum
FROM
    integer_table; -- Replace 'your_table_name' with the actual name of your table

-- Loop through league_id from 1 to 5 and generate fixtures
DO $$
DECLARE
    current_league_id INT := 1;
    home_club_id INT;
    away_club_id INT;
    random_matchweek_id INT;
    random_referee_id INT;
BEGIN
    -- Loop through each league_id
    WHILE current_league_id <= 5 LOOP
        -- Get all clubs in the current league
        FOR home_club_id IN SELECT id FROM clubs WHERE league_id = current_league_id ORDER BY id LOOP
            -- Loop through clubs again to find an opponent
            FOR away_club_id IN SELECT id FROM clubs WHERE league_id = current_league_id ORDER BY id LOOP
                -- Ensure home_club_id is not equal to away_club_id
                IF home_club_id != away_club_id THEN
                    -- Generate random matchweek_id and referee_id
                    random_matchweek_id := FLOOR(RANDOM() * 19) + 1; -- Adjust the range as needed
                    random_referee_id := FLOOR(RANDOM() * 15) + 1; -- Generate a random referee_id between 1 and 15

                    -- Insert the fixture
                    BEGIN
                        INSERT INTO fixtures (
                            home_club_id, away_club_id, league_id, matchweek_id, referee_id
                        ) VALUES (
                            home_club_id, away_club_id, current_league_id, random_matchweek_id, random_referee_id
                        );
                    EXCEPTION
                        WHEN unique_violation THEN
                            -- Handle unique violation, do nothing
                            NULL;
                    END;
                END IF;
            END LOOP;
        END LOOP;
        -- Move to the next league_id
        current_league_id := current_league_id + 1;
    END LOOP;
END $$;


-- Clear existing data in the starting_lineup table
DELETE FROM starting_lineup;

-- Loop through each fixture
DO $$
DECLARE
    current_fixture RECORD;
    home_club_id INT;
    away_club_id INT;
    player_position TEXT;
    positions TEXT[] := ARRAY['Keeper', 'Right-Back', 'Right Wing-Back', 'Left-Back', 'Left Wing-Back', 'Center-Back', 'Center-Back', 'Central Midfielder', 'Defensive Midfielder', 'Attacking Midfielder', 'Left Winger', 'Left Midfielder', 'Striker', 'Right Winger', 'Right Midfielder'];
    player_positions TEXT[];
    loop_club_id INT; -- Renamed from club_id to avoid ambiguity
    player_count INT;
    matchweek_offset INT;
    player_record RECORD;
BEGIN
    -- Loop through each fixture
    FOR current_fixture IN SELECT * FROM fixtures LOOP
        -- Get home and away club IDs
        home_club_id := current_fixture.home_club_id;
        away_club_id := current_fixture.away_club_id;

        -- Randomize matchweek offset for variety
        matchweek_offset := FLOOR(RANDOM() * 100);

        -- Loop through each club (home first, then away)
        FOREACH loop_club_id IN ARRAY ARRAY[home_club_id, away_club_id] LOOP
            -- Initialize an array to store player positions
            player_positions := positions;

            -- Loop to insert players for each position
            FOREACH player_position IN ARRAY player_positions LOOP
                -- Initialize player count for the current position
                IF player_position = 'Center-Back' THEN
                    player_count := 2;
                ELSE
                    player_count := 1;
                END IF;

                -- Randomize player selection for variety
                FOR player_record IN
                    SELECT p.id, p.position FROM players p
                    WHERE p.club_id = loop_club_id
                    AND p.position IN (player_position, CASE
                                                        WHEN player_position = 'Right-Back' THEN 'Right Wing-Back'
                                                        WHEN player_position = 'Left-Back' THEN 'Left Wing-Back'
                                                        WHEN player_position = 'Left Winger' THEN 'Left Midfielder'
                                                        WHEN player_position = 'Right Winger' THEN 'Right Midfielder'
                                                        ELSE player_position
                                                    END)
                    ORDER BY RANDOM() + matchweek_offset
                    LIMIT player_count
                LOOP
                    -- Insert the starting lineup
                    INSERT INTO starting_lineup (fixture_id, club_id, player_id)
                    VALUES (current_fixture.id, loop_club_id, player_record.id);

                    -- Handle positions, ensuring to account for 2 center-backs
                    IF player_record.position = 'Center-Back' THEN
                        IF ARRAY_LENGTH(array_remove(player_positions, 'Center-Back'), 1) >= 2 THEN
                            -- Only remove 'Center-Back' if we still need another one
                            player_positions := array_remove(player_positions, 'Center-Back');
                        ELSE
                            -- If we only need one more 'Center-Back', keep it in the array
                            player_positions := array_remove(player_positions, 'Center-Back', 1);
                        END IF;
                    ELSE
                        -- Remove the inserted position from the array
                        player_positions := array_remove(player_positions, player_record.position);
                    END IF;
                END LOOP;
            END LOOP;
        END LOOP;
    END LOOP;
END $$;



CREATE VIEW starting_lineup_view AS
SELECT sl.id AS lineup_id,
       sl.club_id,
       sl.fixture_id,
       p.name AS player_name,  -- Selecting the player's name from the players table
       f.home_club_id,
       f.away_club_id,
       f.league_id,
       f.matchweek_id,
       f.referee_id
FROM starting_lineup sl
JOIN fixtures f ON sl.fixture_id = f.id
JOIN players p ON sl.player_id = p.id;  -- Joining the players table to get the player's name

drop table temp_matchweek_ids;
-- Create a temporary table to hold the unique random values
CREATE TEMPORARY TABLE temp_matchweek_ids AS
SELECT id, row_number() OVER () AS matchweek_id
FROM (
  SELECT id
  FROM fixtures
  WHERE (home_club_id = 4 OR away_club_id = 3) AND matchweek_id IS NULL
  ORDER BY RANDOM()
) sub;

-- Update the fixtures table using the unique random values
UPDATE fixtures
SET matchweek_id = temp_matchweek_ids.matchweek_id
FROM temp_matchweek_ids
WHERE fixtures.id = temp_matchweek_ids.id;


select * from fixtures 
where home_club_id = 2
or away_club_id = 2;



UPDATE players SET name = 'Alaves' WHERE name = 'Alavés' AND league_id = 4;

SELECT p.id, p.name, p.position 
      FROM players p 
      LEFT JOIN starting_lineup sl ON p.id = sl.player_id AND sl.fixture_id = 25
      WHERE sl.player_id IS NULL AND p.club_id = 15