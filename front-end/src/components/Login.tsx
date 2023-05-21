import React, { useState } from 'react';
import axios from '../utils/axios';
import styles from '../styles/Login.module.css';

type LoginProps = {
  setToken: (token: string) => void;
  setIsAdmin: (isAdmin: boolean) => void;
};

const Login: React.FC<LoginProps> = ({ setToken, setIsAdmin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post('/auth/login', {
        username,
        password,
      });
      const token = response.data.token;
      setToken(token);
      setIsAdmin(response.data.isAdmin);
    } catch (error) {
      setError('Unknown error');
    }
  };

  return (
    <div className={styles.loginPage}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.maintitle}>
          <h2 className={styles.secondarytitle}>WELCOME BACK</h2>
          <h2 className={styles.title}>Log into your accountttttt</h2>
        </h2>
        {error && <div className={styles.error}>{error}</div>}
        <div>
          <label htmlFor="username" className={styles.label}>
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={styles.input}
          />
        </div>
        <div>
          <label htmlFor="password" className={styles.label}>
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
          />
        </div>
        <button type="submit" className={styles.button}>
          Login now
        </button>
      </form>
    </div>
  );
};

export default Login;
