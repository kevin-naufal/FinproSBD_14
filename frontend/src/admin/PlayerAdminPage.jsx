import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';

const PlayerAdminPage = () => {
  const [players, setPlayers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [fieldToUpdate, setFieldToUpdate] = useState('');
  const [newValue, setNewValue] = useState('');

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/players');
        setPlayers(response.data);
      } catch (error) {
        console.error('Error fetching players:', error);
      }
    };
    fetchPlayers();
  }, []);

  const handleUpdateClick = (player) => {
    setSelectedPlayer(player);
    setShowModal(true);
  };

  const handleUpdatePlayer = async () => {
    try {
      const response = await axios.put(`http://localhost:5000/api/players/${selectedPlayer.id}`, {
        updates: { [fieldToUpdate]: newValue },
      });
      setPlayers((prevPlayers) =>
        prevPlayers.map((player) =>
          player.id === response.data.id ? response.data : player
        )
      );
      setShowModal(false);
      setSelectedPlayer(null);
      setFieldToUpdate('');
      setNewValue('');
    } catch (error) {
      console.error('Error updating player:', error);
    }
  };

  return (
    <div>
      <h1>Player Admin Page</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Club ID</th>
            <th>Height</th>
            <th>Shirt Number</th>
            <th>Age</th>
            <th>Date of Birth</th>
            <th>Preferred Foot</th>
            <th>Country</th>
            <th>Position</th>
            <th>Market Value</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player) => (
            <tr key={player.id}>
              <td>{player.id}</td>
              <td>{player.name}</td>
              <td>{player.club_id}</td>
              <td>{player.height}</td>
              <td>{player.shirt_number}</td>
              <td>{player.age}</td>
              <td>{player.date_of_birth}</td>
              <td>{player.preferred_foot}</td>
              <td>{player.country}</td>
              <td>{player.position}</td>
              <td>{player.market_value}</td>
              <td>
                <button onClick={() => handleUpdateClick(player)}>Update</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal isOpen={showModal} onRequestClose={() => setShowModal(false)}>
        <h2>Update Player</h2>
        <div>
          <label>Field to update:</label>
          <select
            value={fieldToUpdate}
            onChange={(e) => setFieldToUpdate(e.target.value)}
          >
            <option value="">Select field</option>
            <option value="name">Name</option>
            <option value="club_id">Club ID</option>
            <option value="height">Height</option>
            {/* Add options for the rest of the fields */}
          </select>
        </div>
        <div>
          <label>New value:</label>
          <input
            type="text"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
          />
        </div>
        <button onClick={handleUpdatePlayer}>Save</button>
        <button onClick={() => setShowModal(false)}>Cancel</button>
      </Modal>
    </div>
  );
};

export default PlayerAdminPage;