import React, { useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Alert,
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Link,
} from "@mui/material"; // Tambahkan Link dari MUI
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Navigate } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom"; // Import Link as RouterLink
import "./LoginPage.css"; // Import the CSS file for styling

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [redirect, setRedirect] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/login", {
        username,
        password,
      });
      // localStorage.setItem("hasLoggedIn", true);
      if (response.status === 200) {
        setSuccessMessage("Login successful! Redirecting...");
        setTimeout(() => setRedirect(true), 2000);
      }
    } catch (error) {
      setError("Invalid username or password");
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  if (redirect) {
    return <Navigate to="/" delay={2000} />;
  }

  return (
    <div className="login-page ">
      <Typography variant="h3" component="h2" gutterBottom>
        ScoreStatsFC
      </Typography>
      <Container
        maxWidth="sm"
        className="login-container  border-2 border-black bg-[#EDF1D6]"
      >
        <Box my={4}>
          <Typography variant="h4" component="h1" gutterBottom>
            Login
          </Typography>
          {error && <Alert severity="error">{error}</Alert>}
          {successMessage && <Alert severity="success">{successMessage}</Alert>}
          <form className="login-form" onSubmit={handleSubmit}>
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
            <div className="form-group">
              <label>Password:</label>
              <TextField
                variant="outlined"
                fullWidth
                type={showPassword ? "text" : "password"}
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
            <button
              className="submit-button"
              type="submit"
              style={{ backgroundColor: "#609966" }}
            >
              Login
            </button>
            <Typography
              variant="body2"
              color="textSecondary"
              align="center"
              style={{ marginTop: "10px" }}
            >
              Belum punya akun?{" "}
              <Link component={RouterLink} to="/signup">
                Daftar di sini
              </Link>
            </Typography>
          </form>
        </Box>
      </Container>
    </div>
  );
};

export default Login;
