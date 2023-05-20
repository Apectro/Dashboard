import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/Navbar.module.css'; // Update the import statement

type NavbarProps = {
  handleLogout: () => void;
};

const Navbar: React.FC<NavbarProps> = ({ handleLogout }) => {
  return (
    <div className={styles.navbar}>
      {' '}
      {/* Update the className */}
      <ul>
        <li>
          <Link to="/dashboard/logs">Logs</Link>
        </li>
        <li>
          <Link to="/dashboard/data">Data</Link>
        </li>
        {/* Add more li elements here as needed for additional nav items */}
        <li>
          <button onClick={handleLogout}>Logout</button>
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
