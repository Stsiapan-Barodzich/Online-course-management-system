import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <nav>
        <ul>
          <li><Link to="/courses">Courses</Link></li>
          <li><Link to="/submissions">Submissions</Link></li>
          <li><Link to="/grades">Grades</Link></li>
          <li><Link to="/login" className="logout-link">Log out</Link></li>

        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
