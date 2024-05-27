
--Keepers
INSERT INTO players (name, club_id, height, shirt_number, age, date_of_birth, preferred_foot, country, market_value, position)
VALUES
    ('Francesco Rossi', 1, 193, 31, 33, '1991-04-27', 'Right', 'Italy', '€150K', 'Keeper'),
    ('Juan Musso', 1, 191, 1, 30, '1994-05-06', 'Right', 'Argentina', '€8.5M', 'Keeper'),
    ('Marco Carnesecchi', 1, 193, 29, 23, '2000-07-01', 'Right', 'Italy', '€18M', 'Keeper'),
    ('Paolo Vismara', 1, NULL, 40, 21, '2003-03-28', NULL, 'Italy', '€350K', 'Keeper'),
    ('Andrea Bonanomi', 1, NULL, 51, 18, '2006-01-31', 'Left', 'Italy', '€40K', 'Keeper');

--Defenders
INSERT INTO players (name, club_id, height, shirt_number, age, date_of_birth, preferred_foot, country, market_value, position)
VALUES
    ('Rafael Toloi', 1, 185, 2, 33, '1990-10-10', 'Right', 'Italy', '€6.2M', 'Center-Back'),
    ('Davide Zappacosta', 1, 185, 77, 31, '1992-06-11', 'Right', 'Italy', '€7M', 'Right Wing-Back'),
    ('Sead Kolasinac', 1, 183, 23, 30, '1993-06-20', 'Left', 'Bosnia-Herzegovina', '€8.5M', 'Center-Back'),
    ('Mitchel Bakker', 1, 178, 20, 23, '2000-06-20', 'Left', 'Netherlands', '€8.5M', 'Left Wing-Back'),
    ('Emil Holm', 1, 191, 3, 24, '2000-05-13', 'Right', 'Sweden', '€6M', 'Right Wing-Back'),
    ('Giorgio Scalvini', 1, 194, 42, 20, '2003-12-11', 'Right', 'Italy', '€41M', 'Center-Back'),
    ('Tommaso Del Lungo', 1, NULL, 46, 20, '2003-11-21', NULL, 'Italy', '€350K', 'Center-Back'),
    ('José Luis Palomino', 1, 186, 6, 34, '1990-01-05', 'Left', 'Argentina', '€1.5M', 'Center-Back'),
    ('Berat Djimsiti', 1, 190, 19, 31, '1993-02-19', 'Right', 'Albania', '€15M', 'Center-Back'),
    ('Hans Hateboer', 1, 180, 33, 30, '1994-01-09', 'Right', 'Netherlands', '€6.2M', 'Right Wing-Back'),
    ('Isak Hien', 1, 191, 4, 25, '1999-01-13', 'Right', 'Sweden', '€10M', 'Center-Back'),
    ('Matteo Ruggeri', 1, 179, 22, 21, '2002-07-11', 'Left', 'Italy', '€20M', 'Left Wing-Back'),
    ('Giovanni Bonfanti', 1, 187, 43, 21, '2003-01-17', 'Left', 'Italy', '€1.5M', 'Center-Back');

--Midfielders
INSERT INTO players (name, club_id, height, shirt_number, age, date_of_birth, preferred_foot, country, market_value, position)
VALUES
    ('Marten de Roon', 1, 185, 15, 33, '1991-03-29', 'Right', 'Netherlands', '€8.5M', 'Central Midfielder'),
    ('Mario Pasalic', 1, 186, 8, 29, '1995-02-09', 'Right', 'Croatia', '€18M', 'Central Midfielder'),
    ('Michel Ndary Adopo', 1, 187, 25, 23, '2000-07-19', 'Right', 'France', '€1.5M', 'Central Midfielder'),
    ('Simone Panada', 1, 175, NULL, 21, '2002-06-02', NULL, 'Italy', '€380K', 'Defensive Midfielder'),
    ('Aleksey Miranchuk', 1, 185, 59, 28, '1995-10-17', 'Left', 'Russia', '€8M', 'Attacking Midfielder'),
    ('Teun Koopmeiners', 1, 186, 7, 26, '1998-02-28', 'Left', 'Netherlands', '€45M', 'Attacking Midfielder'),
    ('Ederson', 1, 183, 13, 24, '1999-07-07', 'Right', 'Brazil', '€25M', 'Central Midfielder');

--Forwards
INSERT INTO players (name, club_id, height, shirt_number, age, date_of_birth, preferred_foot, country, market_value, position)
VALUES
    ('Ademola Lookman', 1, 174, 11, 26, '1997-10-20', 'Right', 'Nigeria', '€31M', 'Striker'),
    ('El Bilal Touré', 1, 185, 10, 22, '2001-10-03', 'Both', 'Mali', '€15M', 'Striker'),
    ('Gianluca Scamacca', 1, 195, 90, 25, '1999-01-01', 'Both', 'Italy', '€30M', 'Striker'),
    ('Charles De Ketelaere', 1, 185, 17, 23, '2001-03-10', 'Left', 'Belgium', '€25M', 'Striker');
