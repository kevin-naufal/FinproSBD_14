import React, { useState } from 'react';
import axios from 'axios';
import { Container, Typography, Alert, Box, IconButton, InputAdornment, TextField } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Navigate } from 'react-router-dom';
import '../style/SignupPage.css'; // Import the CSS file for styling

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [redirect, setRedirect] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/signup', { username, email ,password });
      if (response.status === 201) {
        setSuccessMessage('User created successfully');
        setError('');
      }
    } catch (error) {
      setError('Signup failed. Please try again.');
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  if (redirect) {
    return <Navigate to="/" delay={2000} />;
  }

  return (
    <div className="signup-page">
      <Typography variant="h3" component="h2" gutterBottom>
        ScoreStatsFC
      </Typography>
      <Container maxWidth="sm" className="signup-container  border-2 border-black bg-[#EDF1D6]">
        <Box my={4}>
          <Typography variant="h4" component="h1" gutterBottom>
            Signup
          </Typography>
          {error && <Alert severity="error">{error}</Alert>}
          {successMessage && <Alert severity="success">{successMessage}</Alert>}
          <form className="signup-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Username:</label>
              <TextField
                variant="outlined"
                fullWidth
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className='form-group'>
              <label>Email:</label>
              <TextField
               variant="outlined"
               fullWidth
               type="email"
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               />
            </div>
            <div className="form-group">
              <label>Password:</label>
              <TextField
                variant="outlined"
                fullWidth
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleClickShowPassword}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </div>
            <div className="form-group">
              <label>Confirm Password:</label>
              <TextField
                variant="outlined"
                fullWidth
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleClickShowPassword}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </div>
            <button className="submit-button" type="submit" style={{ backgroundColor: '#609966' }}>
              Signup
            </button>
          </form>
        </Box>
      </Container>
    </div>
  );
};

export default Signup;
