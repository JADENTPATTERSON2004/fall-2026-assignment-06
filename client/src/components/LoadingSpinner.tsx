import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Loading...',
}) => {
  return (
    <div className="spinner-container" role="status" aria-live="polite">
      <div className="spinner" />
      <span className="spinner-text">{message}</span>
    </div>
  );
};
