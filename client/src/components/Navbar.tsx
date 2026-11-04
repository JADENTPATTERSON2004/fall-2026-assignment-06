import React from 'react';
import { Link, NavLink } from 'react-router-dom';

export const Navbar: React.FC = () => {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">📰</span>
          <span className="brand-title">Articles & Comments</span>
        </Link>
        <nav className="navbar-links">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `nav-link ${isActive ? 'active' : ''}`
            }
          >
            Articles
          </NavLink>
          <NavLink
            to="/articles/new"
            className={({ isActive }) =>
              `btn btn-primary nav-cta ${isActive ? 'active' : ''}`
            }
          >
            + Create Article
          </NavLink>
        </nav>
      </div>
    </header>
  );
};
