--Goalkeepers
INSERT INTO players (name, club_id, height, shirt_number, age, date_of_birth, preferred_foot, country, market_value, position)
VALUES 
  ('Rui Patrício', 16, 190, 1, 36, '1988-02-15', 'Left', 'Portugal', '€5.5M', 'Keeper'),
  ('Pietro Boer', 16, 193, 63, 22, '2002-05-12', 'Right', 'Italy', '€155K', 'Keeper'),
  ('Mile Svilar', 16, 189, 99, 24, '1999-08-27', 'Right', 'Serbia', '€1.6M', 'Keeper'),
  ('Renato Bellucci', 16, NULL, NULL, 17, '2006-07-10', 'Left', 'Italy', NULL, 'Keeper');

--Defenders
INSERT INTO players (name, club_id, height, shirt_number, age, date_of_birth, preferred_foot, country, market_value, position)
VALUES 
  ('Chris Smalling', 16, 194, 6, 34, '1989-11-22', 'Right', 'England', '€8.5M', 'Center-Back'),
  ('Diego Llorente', 16, 185, 14, 30, '1993-08-16', 'Right', 'Spain', '€13M', 'Center-Back'),
  ('Gianluca Mancini', 16, 190, 23, 28, '1996-04-17', 'Right', 'Italy', '€25M', 'Center-Back'),
  ('Rasmus Kristensen', 16, 176, 43, 26, '1997-07-11', 'Right', 'Denmark', '€14M', 'Right Midfielder'),
  ('Mehmet Zeki Celik', 16, 180, 19, 27, '1997-02-17', 'Right', 'Turkiye', '€11M', 'Right-Back'),
  ('Leonardo Spinazzola', 16, 185, 37, 31, '1993-03-25', 'Right', 'Italy', '€16M', 'Left-Back'),
  ('Rick Karsdorp', 16, 184, 2, 29, '1995-02-11', 'Right', 'Netherlands', '€10M', 'Right-Back'),
  ('Angelino', 16, 170, 69, 27, '1997-01-04', 'Left', 'Spain', '€15M', 'Left-Back'),
  ('Evan N Dicka', 16, 192, 5, 24, '1999-08-20', 'Left', 'Ivory Coast', '€29M', 'Center-Back'),
  ('Dean Huijsen', 16, 195, 3, 19, '2005-04-14', 'Both', 'Spain', '€13M', 'Center-Back'),
  ('Lovro Golic', 16, NULL, NULL, 18, '2006-03-05', 'Right', 'Slovenia', NULL, 'Center-Back');


--Midfielders
INSERT INTO players (name, club_id, height, shirt_number, age, date_of_birth, preferred_foot, country, market_value, position)
VALUES 
  ('Leandro Paredes', 16, 180, 16, 29, '1994-06-29', 'Right', 'Argentina', '€13M', 'Central Midfielder'),
  ('Lorenzo Pellegrini', 16, 186, 7, 27, '1996-06-19', 'Right', 'Italy', '€36M', 'Central Midfielder'),
  ('Houssem Aouar', 16, 175, 22, 25, '1998-06-30', 'Right', 'Algeria', '€18M', 'Central Midfielder'),
  ('Martin Vetkal', 16, NULL, 65, 20, '2004-02-21', NULL, 'Estonia', '€75K', 'Central Midfielder'),
  ('Mattia Mannini', 16, 170, 66, 17, '2006-07-08', 'Right', 'Italy', NULL, 'Midfielder'),
  ('Francesco D Alessio', 16, 176, NULL, 20, '2004-02-21', NULL, 'Italy', '€75K', 'Midfielder'),
  ('Bryan Cristante', 16, 186, 4, 29, '1995-03-03', 'Right', 'Italy', '€19M', 'Central Midfielder'),
  ('Renato Sanches', 16, 176, 20, 26, '1997-08-18', 'Right', 'Portugal', '€16M', 'Central Midfielder'),
  ('Nicola Zalewski', 16, 175, 59, 22, '2002-01-23', 'Right', 'Poland', '€16M', 'Left Midfielder'),
  ('Edoardo Bove', 16, 179, 52, 22, '2002-05-16', 'Right', 'Italy', '€5M', 'Central Midfielder'),
  ('Riccardo Pagano', 16, 175, 60, 19, '2004-11-28', 'Right', 'Italy', '€2M', 'Midfielder');

--Forwards
INSERT INTO players (name, club_id, height, shirt_number, age, date_of_birth, preferred_foot, country, market_value, position)
VALUES 
  ('Stephan El Shaarawy', 16, 178, 92, 31, '1992-10-27', 'Right', 'Italy', '€5.5M', 'Left Winger'),
  ('Paulo Dybala', 16, 177, 21, 30, '1993-11-15', 'Left', 'Argentina', '€27M', 'Striker'),
  ('Tammy Abraham', 16, 190, 9, 26, '1997-10-02', 'Right', 'England', '€40M', 'Striker'),
  ('Luigi Cherubini', 16, 175, 64, 20, '2004-01-15', NULL, 'Italy', '€250K', 'Striker'),
  ('Joao Costa', 16, NULL, 67, 19, '2005-03-28', 'Left', 'Brazil', NULL, 'Right Winger'),
  ('Romelu Lukaku', 16, 190, 90, 31, '1993-05-13', 'Left', 'Belgium', '€33M', 'Striker'),
  ('Sardar Azmoun', 16, 186, 17, 29, '1995-01-01', 'Both', 'Iran', '€13M', 'Striker'),
  ('Tommaso Baldanzi', 16, 170, 35, 21, '2003-03-23', 'Left', 'Italy', '€20M', 'Attacking Midfielder'),
  ('Niccolo Pisilli', 16, NULL, 61, 19, '2004-09-23', 'Right', 'Italy', '€20K', 'Left Winger');
