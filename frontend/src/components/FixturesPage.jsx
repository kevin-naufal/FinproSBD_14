import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PageContent } from '../Header'; // Import the PageContent component

const FixturePage = () => {
  const [fixtures, setFixtures] = useState([]);
  const [selectedMatchweek, setSelectedMatchweek] = useState('');

  useEffect(() => {
    const fetchFixtures = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/fixtures/matchweek/${selectedMatchweek}`);
        if (response.data.length === 0) {
          setFixtures([]);
        } else {
          setFixtures(response.data);
        }
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
      <div>
        <h2>Fixtures</h2>
        <label htmlFor="matchweek">Select Matchweek: </label>
        <select id="matchweek" value={selectedMatchweek} onChange={handleMatchweekChange}>
          <option value="">Select Matchweek</option>
          {[...Array(38).keys()].map((week) => (
            <option key={week + 1} value={week + 1}>Matchweek {week + 1}</option>
          ))}
        </select>
        {/* Render grouped fixtures */}
        {Object.keys(groupedFixtures).map((leagueName, index) => (
          <div key={index}>
            <h3>{leagueName}</h3>
            {groupedFixtures[leagueName].map((fixture, fixtureIndex) => (
              <p key={fixtureIndex}>
                {fixture.home_club_name} [{fixture.home_score}] - {fixture.away_club_name} [{fixture.away_score}]
              </p>
            ))}
          </div>
        ))}
      </div>
    </PageContent>
  );
};

export default FixturePage;
