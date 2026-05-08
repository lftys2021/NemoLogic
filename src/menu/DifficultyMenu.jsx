import React from 'react';

const DifficultyMenu = ({ stages, onSelect, onBack }) => {
  return (
    <div className="menu-overlay">
      <div className="menu-content">
        <h2>난이도 선택</h2>
        <div className="menu-buttons">
          {Object.keys(stages).map((diff) => (
            <button key={diff} className="btn-primary" onClick={() => onSelect(diff)}>
              {diff}
            </button>
          ))}
          <button className="btn-secondary" onClick={onBack}>
            뒤로가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default DifficultyMenu;