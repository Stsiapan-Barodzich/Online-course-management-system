import React from 'react';
import styles from '@Styles/auth.module.css';

const ErrorMessage = ({ message }) => {
  if (!message) return null;
  
  const isSuccess = message.includes("successfully");
  const className = isSuccess ? styles.successMessage : styles.errorMessage;

  return (
    <div className={className}>
      {message}
    </div>
  );
};

export default ErrorMessage;
