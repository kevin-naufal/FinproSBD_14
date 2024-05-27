import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PageContent } from '../Header'; // Import PageContent component

const TransferPage = () => {
  const [transfers, setTransfers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTransfers = async () => {
      try {
        // Fetch transferred players
        const response = await axios.get('http://localhost:5000/api/transfers');
        setTransfers(response.data);
      } catch (error) {
        // Display error message if the request fails
        setError('Failed to fetch transfers');
      }
    };

    fetchTransfers();
  }, []);

  return (
    <PageContent> {/* Wrap content with PageContent */}
      <div>
        {error && <p>{error}</p>}
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={tableHeaderStyle}>Player</th>
              <th style={tableHeaderStyle}>Age</th>
              <th style={tableHeaderStyle}>Market Value</th>
              <th style={tableHeaderStyle}>Nationality</th>
              <th style={tableHeaderStyle}>Left Club</th>
              <th style={tableHeaderStyle}>Joined Club</th>
              <th style={tableHeaderStyle}>Fee</th>
            </tr>
          </thead>
          <tbody>
            {transfers.map((transfer, index) => (
              <tr key={index} style={index % 2 === 0 ? evenRowStyle : oddRowStyle}>
                <td style={tableCellStyle}>{transfer.player}</td>
                <td style={tableCellStyle}>{transfer.age}</td>
                <td style={tableCellStyle}>{transfer.market_value}</td>
                <td style={tableCellStyle}>{transfer.nationality}</td>
                <td style={tableCellStyle}>{transfer.left}</td>
                <td style={tableCellStyle}>{transfer.joined}</td>
                <td style={tableCellStyle}>{transfer.fee}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageContent>
  );
};

export default TransferPage;

// Styles
const tableHeaderStyle = {
  background: '#333',
  color: '#fff',
  padding: '10px',
  textAlign: 'left',
};

const tableCellStyle = {
  border: '1px solid #ddd',
  padding: '10px',
};

const evenRowStyle = {
  background: '#f2f2f2',
};

const oddRowStyle = {
  background: '#fff',
};
