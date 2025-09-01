import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="header">
      <h1>Student Management System</h1>
      <Link to="/login" className="logout-link">Log out</Link>
    </header>
  );
};

export default Header;