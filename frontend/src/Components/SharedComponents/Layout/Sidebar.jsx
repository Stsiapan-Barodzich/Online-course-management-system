import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@Contexts/AuthContext';

const Sidebar = () => {
  const { logoutUser } = useAuth();

  return (
    <aside className="sidebar">
      <nav>
        <ul>
          <li>
            <Link to="/courses" className="sidebar-link">Courses</Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;