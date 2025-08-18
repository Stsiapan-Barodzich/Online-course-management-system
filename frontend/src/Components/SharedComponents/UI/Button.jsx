import React from 'react';

const Button = ({ children, type = 'button', variant = 'primary', onClick, style, ...props }) => {
  return (
    <button
      type={type}
      className={`btn btn-${variant}`}
      onClick={onClick}
      style={style}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

