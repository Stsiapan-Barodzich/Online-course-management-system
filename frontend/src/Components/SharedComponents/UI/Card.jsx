import React from 'react';

const Card = ({ children, style, ...props }) => {
  return (
    <div className="card" style={style} {...props}>
      {children}
    </div>
  );
};

export default Card;

