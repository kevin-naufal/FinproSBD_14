import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { PageContent } from '../Header'; // Import the PageContent component

const ClubDetailPage = () => {
  const { id } = useParams(); // Get the club ID from the URL params
  const [club, setClub] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClub = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/clubs/${id}`);
        setClub(response.data);
      } catch (error) {
        setError('Error fetching club details');
      }
    };

    fetchClub();
  }, [id]);

  if (error) {
    return <p>{error}</p>;
  }

  if (!club) {
    return <p>Loading...</p>;
  }

  return (
    <PageContent> {/* Apply padding to the content */}
      <div>
        <h2>{club.name}</h2>
        <p><strong>League:</strong> {club.league_name} - {club.league_country}</p> {/* Display league name and country */}
        <p><strong>Manager:</strong> {club.manager}</p>
        <p><strong>Stadium:</strong> {club.stadium}</p>
      </div>
    </PageContent>
  );
};

export default ClubDetailPage;
