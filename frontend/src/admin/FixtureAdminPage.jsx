import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';

function FixtureAdminPage() {
  const [formData, setFormData] = useState({
    home_club_id: '',
    away_club_id: '',
    league_id: '',
    matchweek_id: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [redirect, setRedirect] = useState(false);
  const [redirectData, setRedirectData] = useState(null);
  const [leagues, setLeagues] = useState([]);
  const [homeClubs, setHomeClubs] = useState([]);
  const [awayClubs, setAwayClubs] = useState([]);

  useEffect(() => {
    const fetchLeagues = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/leagues');
        setLeagues(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch leagues');
      }
    };
    fetchLeagues();
  }, []);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'league_id') {
      try {
        const res = await axios.get(`http://localhost:5000/api/clubs/by-league/${value}`);
        if (res.data) {
          if (res.data.length > 0) {
            setHomeClubs(res.data);
            setAwayClubs(res.data);
          }
        }
      } catch (err) {
        console.error(err);
        setError('Failed to fetch clubs');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const home_score = Math.floor(Math.random() * 11);
      const away_score = Math.floor(Math.random() * 11);
      const postData = { ...formData, home_score, away_score };
      const res = await axios.post('http://localhost:5000/api/fixtures', postData);
      setMessage('Fixture created successfully!');
      setError('');
      console.log(res.data);
      setRedirectData({ home_club_id: formData.home_club_id, away_club_id: formData.away_club_id });
      setRedirect(true);
    } catch (err) {
      console.error(err);
      setError('Failed to create fixture');
      setMessage('');
    }
  };

  if (redirect) {
    return <Navigate to="/admin/starter" state={redirectData} />;
  }

  return (
    <div>
      <h1>Create New Fixture</h1>
      <form onSubmit={handleSubmit}>
        <label>
          League ID:
          <select name="league_id" value={formData.league_id} onChange={handleChange}>
            <option value="">Select League</option>
            {leagues.map((league) => (
              <option key={league.id} value={league.id}>{league.name}</option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Home Club ID:
          <select name="home_club_id" value={formData.home_club_id} onChange={handleChange}>
            <option value="">Select Home Club</option>
            {homeClubs.map((club) => (
              <option key={club.id} value={club.id}>{club.name}</option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Away Club ID:
          <select name="away_club_id" value={formData.away_club_id} onChange={handleChange}>
            <option value="">Select Away Club</option>
            {awayClubs.map((club) => (
              <option key={club.id} value={club.id}>{club.name}</option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Matchweek ID:
          <input type="text" name="matchweek_id" value={formData.matchweek_id} onChange={handleChange} />
        </label>
        <br />
        <button type="submit">Create Fixture</button>
      </form>
      {message && <div style={{ color: 'green' }}>{message}</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
}

export default FixtureAdminPage;
