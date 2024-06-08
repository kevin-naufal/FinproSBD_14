import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PageContent } from '../Header'; // Import the PageContent component
import '../style/styles.css'; // Make sure to import the CSS file
import { Link, useNavigate } from 'react-router-dom';

const FixturePage = () => {
  const [fixtures, setFixtures] = useState([]);
  const [selectedMatchweek, setSelectedMatchweek] = useState('1');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFixtures = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/fixtures/matchweek/${selectedMatchweek}`);
        setFixtures(response.data);
      } catch (error) {
        console.error('Failed to fetch fixtures:', error);
      }
    };

    if (selectedMatchweek !== '') {
      fetchFixtures();
    } else {
      setFixtures([]);
    }
  }, [selectedMatchweek]);

  const handleMatchweekChange = (event) => {
    setSelectedMatchweek(event.target.value);
  };

  // Function to handle card click
  const handleCardClick = (fixtureId) => {
    navigate(`/fixture/${fixtureId}`);
  };

  // Function to handle league click
  const handleLeagueClick = (leagueId) => {
    navigate(`/leagues/${leagueId}`);
  };

  // Group fixtures by league name
  const groupedFixtures = {};
  fixtures.forEach((fixture) => {
    const { league_name } = fixture;
    if (!groupedFixtures[league_name]) {
      groupedFixtures[league_name] = [];
    }
    groupedFixtures[league_name].push(fixture);
  });

  return (
    <PageContent>
      <div className="container-wrapper flex flex-col justify-center items-center "> {/* Centered container */}
        <div className="mb-8 p-6 border rounded-lg shadow-lg bg-white w-full max-w-4xl border-2 border-black bg-[#609966]">
          <label htmlFor="matchweek" className="block mb-2 ">Select Matchweek: </label>
          <select
            id="matchweek"
            value={selectedMatchweek}
            onChange={handleMatchweekChange}
            className="border p-2 rounded shadow outline-none" // Added shadow class
            style={{ borderColor: '#ccc', width: '150px' }} // Added custom styles
          >
            <option value="1">Matchweek 1</option>
            {[...Array(38).keys()].map((week) => (
              <option key={week + 1} value={week + 1}>Matchweek {week + 1}</option>
            ))}
          </select>
        </div>
  
        {/* Render grouped fixtures */}
        {Object.keys(groupedFixtures).map((leagueName, index) => (
          <div key={index} className="mb-8 p-6 border rounded-lg shadow-lg bg-white w-full max-w-4xl border-2 border-black bg-[#9DC08B]">
            <h3 className="text-2xl font-semibold mb-4 border-b pb-2 ">
              <button className="league-button" onClick={() => handleLeagueClick(groupedFixtures[leagueName][0].league_id)}>
                {leagueName}
              </button>
            </h3>
            <div className="flex flex-col gap-4">
              {groupedFixtures[leagueName].map((fixture, fixtureIndex) => (
                <Link
                  to={`/fixture/${fixture.id}`} // Navigate to /fixture/:fixture_id
                  key={fixtureIndex}
                  className="fixture-card"
                  onClick={() => handleCardClick(fixture.id)} // Handle card click
                >
                  <div className="score-line">
                    <span className="score">{fixture.home_score}</span>
                    <span className="dash">-</span>
                    <span className="score">{fixture.away_score}</span>
                    </div>
                      <div className="clubs">
                        <span className="team-name" onClick={(event) => { event.stopPropagation(); }}>
                          <Link to={`/club/${fixture.home_club_id}`}>
                            {fixture.home_club_name}
                          </Link>
                        </span>
                        <span className="team-name" onClick={(event) => { event.stopPropagation(); }}>
                          <Link to={`/club/${fixture.away_club_id}`}>
                            {fixture.away_club_name}
                          </Link>
                        </span>
                    </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </PageContent>
  );
}

export default FixturePage;
