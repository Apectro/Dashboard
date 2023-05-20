import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import '../styles/Dashboard.css';

type DashboardProps = {
  handleLogout: () => void;
  isAdmin: boolean;
};

const Dashboard: React.FC<DashboardProps> = ({ handleLogout, isAdmin }) => {
  return (
    <div className="dashboard">
      <Navbar handleLogout={handleLogout} />
      <main className="dashboard-content">
        <Outlet /> {/* This is where child routes will get rendered */}
      </main>
    </div>
  );
};

export default Dashboard;
