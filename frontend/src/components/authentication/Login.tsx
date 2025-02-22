// Login component

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = ({updateAuthState}: {updateAuthState: () => void}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/auth/login', {
        username,
        password
      });

      localStorage.setItem('token', response.data.token);
      updateAuthState();
      navigate('/tasks');
    } catch (error) {
      setError('Invalid Username or Password');
      console.error('Login error: ', error);
    }
  };

  return(
    <div className="container">
      <div className="card" style={{ maxWidth: '450px', margin: '80px auto' }}>
        <h2 className="text-center mb-4 font-bold" style={{ fontSize: '24px', color: 'var(--primary)' }}>Login</h2>
        
        {error && <div className="alert alert-danger">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary w-full"
          >
            Login
          </button>
        </form>
        
        <p className="text-center mt-4">
          Don't have an account? <Link to="/register" style={{ color: 'var(--primary)' }}>Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;