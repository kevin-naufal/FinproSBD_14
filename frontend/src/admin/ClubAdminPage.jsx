import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ClubAdminPage = () => {
  const [clubs, setClubs] = useState([]);
  const [updatedClub, setUpdatedClub] = useState(null);
  const [updatedFields, setUpdatedFields] = useState({});

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/clubs');
        setClubs(response.data);
      } catch (error) {
        console.error('Error fetching clubs:', error);
      }
    };
    fetchClubs();
  }, []);

  const handleUpdateClub = (club) => {
    setUpdatedClub(club);
    setUpdatedFields({
      league_id: club.league_id,
      name: club.name,
      manager: club.manager,
      stadium: club.stadium,
    });
  };

  const handleFieldChange = (field, value) => {
    setUpdatedFields((prevFields) => ({
      ...prevFields,
      [field]: value,
    }));
  };

  const handleUpdateConfirm = async () => {
    if (updatedClub) {
      try {
        await axios.put(`http://localhost:5000/api/clubs/${updatedClub.id}`, { updates: updatedFields });
        setClubs((prevClubs) =>
          prevClubs.map((club) =>
            club.id === updatedClub.id
              ? { ...club, ...updatedFields }
              : club
          )
        );
        setUpdatedClub(null);
        setUpdatedFields({});
      } catch (error) {
        console.error('Error updating club:', error);
      }
    }
  };

  return (
    <div>
      <h1>Club Admin Page</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Manager</th>
            <th>Stadium</th>
            <th>League</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {clubs.map((club) => (
            <tr key={club.id}>
              <td>{club.id}</td>
              <td>{club.name}</td>
              <td>{club.manager}</td>
              <td>{club.stadium}</td>
              <td>{club.league_name}</td>
              <td>
                {updatedClub && updatedClub.id === club.id ? (
                  <>
                    <input
                      type="text"
                      value={updatedFields.name}
                      onChange={(e) => handleFieldChange('name', e.target.value)}
                    />
                    <input
                      type="text"
                      value={updatedFields.manager}
                      onChange={(e) => handleFieldChange('manager', e.target.value)}
                    />
                    <input
                      type="text"
                      value={updatedFields.stadium}
                      onChange={(e) => handleFieldChange('stadium', e.target.value)}
                    />
                    <button onClick={handleUpdateConfirm}>Confirm Update</button>
                  </>
                ) : (
                  <button onClick={() => handleUpdateClub(club)}>Update</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClubAdminPage;