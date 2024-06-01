// src/pages/LeaguePage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Header, PageContent } from '../Header';

const LeaguePage = () => {
  const [leagues, setLeagues] = useState([]);

  useEffect(() => {
    const fetchLeagues = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/leagues'); // Adjust the URL as needed
        setLeagues(response.data);
      } catch (error) {
        console.error('Error fetching leagues:', error);
      }
    };

    fetchLeagues();
  }, []);

  return (
    <>
      <Header />
      <PageContent>
        <div style={{ padding: '20px' }}>
          <h1>Leagues</h1>
          {leagues.length > 0 ? (
            <ul>
              {leagues.map((league) => (
                <li key={league.id}>{league.name} ({league.country})</li>
              ))}
            </ul>
          ) : (
            <p>No leagues available.</p>
          )}
        </div>
      </PageContent>
    </>
  );
};

export default LeaguePage;
