import React from 'react';
import { Link } from 'react-router-dom';

export const NotFoundPage: React.FC = () => {
  return (
    <main className="page-container not-found-container">
      <div className="not-found-card">
        <h1 className="not-found-code">404</h1>
        <h2>Page Not Found</h2>
        <p>The page you are looking for does not exist or has been moved.</p>
        <Link to="/" className="btn btn-primary">
          Back to Articles
        </Link>
      </div>
    </main>
  );
};
