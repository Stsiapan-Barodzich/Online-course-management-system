import React from 'react';

const Table = ({ headers, data, renderRow, style, ...props }) => {
  return (
    <table className="table" style={style} {...props}>
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th key={index}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => renderRow(item, index))}
      </tbody>
    </table>
  );
};

export default Table;

