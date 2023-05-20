import React, { useState } from 'react';
import { useRoutes, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Logs from './components/Logs';
import Login from './components/Login';
import Register from './components/Register';
import Data from './components/Data';
import { UserContext, UserContextType } from './hooks/UserContext';

const App: React.FC = () => {
  const [token, setToken] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState('');

  const handleLogout = () => {
    setToken('');
    setIsAdmin(false);
  };

  const userContextValue: UserContextType = { username, setUsername };
  const routing = useRoutes([
    {
      path: '/',
      element: <Navigate to="/login" replace />,
    },
    {
      path: '/login',
      element: !token ? (
        <Login setToken={setToken} setIsAdmin={setIsAdmin} />
      ) : (
        <Navigate to="/dashboard" replace />
      ),
    },
    {
      path: '/register',
      element: token ? (
        <Register token={token} isAdmin={isAdmin} />
      ) : (
        <Navigate to="/login" replace />
      ),
    },
    {
      path: '/dashboard/*',
      element: token ? (
        <UserContext.Provider value={userContextValue}>
          <Dashboard handleLogout={handleLogout} isAdmin={isAdmin} />
        </UserContext.Provider>
      ) : (
        <Navigate to="/login" replace />
      ),
      children: [
        {
          path: 'logs',
          element: <Logs handleLogout={handleLogout} isAdmin={isAdmin} />,
        },
        {
          path: 'data',
          element: <Data handleLogout={handleLogout} isAdmin={isAdmin} />,
        },
        // Add more nested routes here as needed
      ],
    },
  ]);

  return routing
};

export default App;
