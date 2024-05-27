import React, { useState } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import { PageContent } from '../Header'; // Import the PageContent component

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [redirect, setRedirect] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/login', { username, password });
      if (response.status === 200) {
        // Login successful, set success message and trigger redirect after delay
        setSuccessMessage('Login successful! Redirecting...');
        setTimeout(() => setRedirect(true), 2000);
      }
    } catch (error) {
      // Login failed, display error message
      setError('Invalid username or password');
    }
  };

  if (redirect) {
    // Navigate after delay
    return <Navigate to="/" delay={2000} />;
  }

  return (
    <PageContent>
      <div>
        <h2>Login</h2>
        {error && <p>{error}</p>}
        {successMessage && <p>{successMessage}</p>}
        <form onSubmit={handleSubmit}>
          <div>
            <label>Username:</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div>
            <label>Password:</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    </PageContent>
  );
};

export default Login;
