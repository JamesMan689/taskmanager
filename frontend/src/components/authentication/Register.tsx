// Register component

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    <div className='authentication-form'>
      <h2>Register</h2>
      {error && <div className='error-message'>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input 
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className='form-group'>
          <label htmlFor="password">Password</label>
          <input 
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Register</button>
      </form>
      <p>
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  );
}

export default Register;