import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CreateFixturePage() {
  const [formData, setFormData] = useState({
    home_club_id: '',
    away_club_id: '',
    league_id: '',
    matchweek_id: '',
    referee_id: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [leagues, setLeagues] = useState([]);
  const [homeClubs, setHomeClubs] = useState([]);
  const [awayClubs, setAwayClubs] = useState([]);
  const [existingFixtureIds, setExistingFixtureIds] = useState([]); // New state for existing fixture IDs
  const [latestMatchweek, setLatestMatchweek] = useState(null); // State to store the latest matchweek ID
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const fetchLatestMatchweek = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/matchweeks/latest-matchweek');
        setLatestMatchweek(response.data.maxMatchweek);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch latest matchweek');
      }
    };
    fetchLatestMatchweek();
  }, []);

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

  useEffect(() => {
    const fetchExistingFixtureIds = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/fixtures');
        setExistingFixtureIds(res.data.map(fixture => fixture.id));
      } catch (err) {
        console.error(err);
        setError('Failed to fetch existing fixture IDs');
      }
    };
    fetchExistingFixtureIds();
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
      const randomRefId = Math.floor(Math.random() * 15) + 1;
      const postData = { ...formData, home_score: null, away_score: null, referee_id: randomRefId };
  
      // Log the content of postData
      console.log('postData:', postData);
  
      const res = await axios.post('http://localhost:5000/api/fixtures', postData);
      setMessage('Fixture created successfully!');
      setError('');

      console.log(latestMatchweek);
      console.log(formData.matchweek_id)

      navigate('/admin');

  
    } catch (err) {
      console.error(err);
      setError('Failed to create fixture');
      setMessage('');
    }
  };
  

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`http://localhost:5000/api/fixtures/${id}`);
      setMessage(res.data.message);
      setError('');
      navigate('/admin');
    } catch (err) {
      console.error(err);
      setError('Failed to delete fixture');
      setMessage('');
    }
  };

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
      {existingFixtureIds.length > 0 && (
        <div>
          <h2>Delete Fixture</h2>
          <label>
            Select Fixture ID to delete:
            <select name="fixture_id_to_delete" value={formData.fixture_id_to_delete} onChange={(e) => setFormData({ ...formData, fixture_id_to_delete: e.target.value })}>
              <option value="">Select Fixture ID</option>
              {existingFixtureIds.map(id => (
                <option key={id} value={id}>{id}</option>
              ))}
            </select>
          </label>
          <button onClick={() => handleDelete(formData.fixture_id_to_delete)}>Delete</button>
        </div>
        )}
      {message && <div style={{ color: 'green' }}>{message}</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
}

export default CreateFixturePage;
