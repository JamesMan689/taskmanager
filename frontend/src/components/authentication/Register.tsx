// Register component

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';


const Register = ({updateAuthState}: {updateAuthState: () => void}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/auth/register', {
        username,
        password
      });

      localStorage.setItem('token', response.data.token);
      updateAuthState();
      navigate('/tasks');
    } catch (error) {
      setError('Registration error');
      console.error('Registration error: ', error);
    }
  }

  return(
    <div className="container">
      <div className="card" style={{ maxWidth: '450px', margin: '80px auto' }}>
        <h2 className="text-center mb-4 font-bold" style={{ fontSize: '24px', color: 'var(--primary)' }}>Register</h2>
        
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
              minLength={6}
            />
            <small style={{ color: 'var(--text-light)' }}>Password must be at least 6 characters long</small>
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary w-full"
          >
            Register
          </button>
        </form>
        
        <p className="text-center mt-4">
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)' }}>Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;