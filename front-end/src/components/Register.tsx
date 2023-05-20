import React, { useState } from 'react';
import axios from '../utils/axios';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Login.module.css';

type RegisterProps = {
  token: string;
  isAdmin: boolean;
};

const Register: React.FC<RegisterProps> = ({ token, isAdmin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        '/auth/register',
        {
          username,
          password,
          isAdmin,
        },
        {
          headers: {
            'x-auth-token': token,
          },
        }
      );
      navigate('/dashboard');
    } catch (error) {
      setError('Unknown error');
    }
  };

  return (
    <div className={styles.loginPage}>
      <form onSubmit={handleSubmit}>
        <h2 className={styles.maintitle}>
          <h2 className={styles.secondarytitle}>Always good to have new people</h2>
          <h2 className={styles.title}>Register a new account</h2>
        </h2>
        {error && <div className="error">{error}</div>}
        <div>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
