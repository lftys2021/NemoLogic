import React from 'react';

const RowHints = ({ rowHints }) => {
  const colors = ['#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231'];

  return (
    <div className="row-hints-container">
      {rowHints.map((hints, i) => (
        <div key={i} className="row-hint">
          {hints.map((h, idx) => (
            <span key={idx} style={{ color: colors[idx % colors.length] }}>
              {h}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
};

export default RowHints;