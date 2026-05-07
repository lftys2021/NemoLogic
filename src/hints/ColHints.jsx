import React from 'react';

const ColHints = ({ colHints }) => {
  const colors = ['#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231'];

  return (
    <div className="col-hints-row">
      <div className="corner-space"></div>
      {colHints.map((hints, i) => (
        <div key={i} className="col-hint">
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

export default ColHints;