import React, { useState } from 'react';
import './ErrorAlert.css';

interface ErrorAlertProps {
  title?: string;
  message: string;
  details?: string;
  onDismiss?: () => void;
  type?: 'error' | 'warning' | 'info';
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({
  title = 'Error',
  message,
  details,
  onDismiss,
  type = 'error',
}) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  if (!isVisible) return null;

  const icons = {
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
  };

  return (
    <div className={`error-alert ${type}`}>
      <div className="alert-header">
        <span className="alert-icon">{icons[type]}</span>
        <h3 className="alert-title">{title}</h3>
        <button className="alert-close" onClick={handleDismiss} aria-label="Close alert">
          ✕
        </button>
      </div>
      <p className="alert-message">{message}</p>
      {details && (
        <details className="alert-details">
          <summary>Details</summary>
          <pre className="alert-details-content">{details}</pre>
        </details>
      )}
    </div>
  );
};