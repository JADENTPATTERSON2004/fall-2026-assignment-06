import React from 'react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onRetry,
}) => {
  return (
    <div className="error-banner" role="alert">
      <div className="error-content">
        <span className="error-icon" aria-hidden="true">⚠️</span>
        <span className="error-text">{message}</span>
      </div>
      {onRetry && (
        <button type="button" className="btn btn-secondary btn-sm" onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  );
};
