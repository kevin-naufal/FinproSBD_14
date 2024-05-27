--Goalkeepers
INSERT INTO players (name, club_id, height, shirt_number, age, date_of_birth, preferred_foot, country, market_value, position)
VALUES 
  ('Lukasz Skorupski', 2, 187, 28, 33, '1991-05-05', 'Right', 'Poland', '€3.6M', 'Keeper'),
  ('Nicola Bagnolini', 2, 193, 23, 20, '2004-03-14', 'Right', 'Italy', '€250K', 'Keeper'),
  ('Federico Ravaglia', 2, 190, 34, 24, '1999-11-11', 'Right', 'Italy', '€500K', 'Keeper');


--Defenders
INSERT INTO players (name, club_id, height, shirt_number, age, date_of_birth, preferred_foot, country, market_value, position)
VALUES 
  ('Lorenzo De Silvestri', 2, 185, 29, 36, '1988-05-23', 'Right', 'Italy', '€420K', 'Right-Back'),
  ('Charalambos Lykogiannis', 2, 186, 22, 30, '1993-10-22', 'Left', 'Greece', '€1.5M', 'Left-Back'),
  ('Jhon Lucumi', 2, 185, 26, 25, '1998-06-26', 'Left', 'Colombia', '€16M', 'Center-Back'),
  ('Riccardo Calafiori', 2, 188, 33, 22, '2002-05-19', 'Left', 'Italy', '€24M', 'Center-Back'),
  ('Mihajlo Ilic', 2, 192, 4, 20, '2003-06-04', NULL, 'Serbia', '€3.5M', 'Center-Back'),
  ('Adama Soumaoro', 2, 187, 5, 31, '1992-06-18', 'Right', 'Ivory Coast', '€3.3M', 'Center-Back'),
  ('Stefan Posch', 2, 188, 3, 27, '1997-05-14', 'Right', 'Austria', '€11M', 'Right-Back'),
  ('Sam Beukema', 2, 188, 31, 25, '1998-11-17', 'Right', 'Netherlands', '€11M', 'Center-Back'),
  ('Victor Kristiansen', 2, 181, 15, 21, '2002-12-16', 'Left', 'Denmark', '€15M', 'Left-Back'),
  ('Tommaso Corazza', 2, 174, 16, 19, '2004-06-29', 'Right', 'Italy', '€950K', 'Right-Back');


--Midfielders
INSERT INTO players (name, club_id, height, shirt_number, age, date_of_birth, preferred_foot, country, market_value, position)
VALUES 
  ('Remo Freuler', 2, 181, 8, 32, '1992-04-15', 'Right', 'Switzerland', '€7M', 'Defensive Midfielder'),
  ('Michel Aebischer', 2, 185, 20, 27, '1997-01-06', 'Right', 'Switzerland', '€6.5M', 'Defensive Midfielder'),
  ('Kazper Karlsson', 2, 184, NULL, 19, '2005-03-21', NULL, 'Sweden', '€440K', 'Left Midfielder'),
  ('Oussama El Azzouzi', 2, 189, 17, 22, '2001-05-29', 'Right', 'Morocco', '€2.5M', 'Central Midfielder'),
  ('Nikola Moro', 2, 183, 6, 26, '1998-03-12', 'Right', 'Croatia', '€7M', 'Defensive Midfielder'),
  ('Lewis Ferguson', 2, 181, 19, 24, '1999-08-24', 'Right', 'Scotland', '€23M', 'Attacking Midfielder'),
  ('Giovanni Fabbian', 2, 186, 80, 21, '2003-01-14', 'Right', 'Italy', '€7.5M', 'Central Midfielder');

--Forwards
INSERT INTO players (name, club_id, height, shirt_number, age, date_of_birth, preferred_foot, country, market_value, position)
VALUES 
  ('Riccardo Orsolini', 2, 183, 7, 27, '1997-01-24', 'Left', 'Italy', '€17M', 'Right Winger'),
  ('Jesper Karlsson', 2, 171, 10, 25, '1998-07-25', 'Right', 'Sweden', '€16M', 'Left Winger'),
  ('Joshua Zirkzee', 2, 193, 9, 23, '2001-05-22', 'Right', 'Netherlands', '€41M', 'Striker'),
  ('Kacper Urbanski', 2, 178, 82, 19, '2004-09-07', 'Right', 'Poland', '€950K', 'Left Winger'),
  ('Jens Odgaard', 2, 188, 21, 25, '1999-03-31', 'Left', 'Denmark', '€4.2M', 'Right Winger'),
  ('Alexis Saelemaekers', 2, 180, 56, 24, '1999-06-27', 'Right', 'Belgium', '€9.5M', 'Left Winger'),
  ('Dan Ndoye', 2, 181, 11, 23, '2000-10-25', 'Right', 'Switzerland', '€9.5M', 'Right Winger'),
  ('Santiago Castro', 2, NULL, 18, 19, '2004-09-18', 'Right', 'Argentina', '€7.3M', 'Striker');
