import React from 'react';

const StageMenu = ({ difficulty, stages, onSelect, onBack }) => {
  return (
    <div className="menu-overlay">
      <div className="menu-content">
        <h2>{difficulty} 스테이지 선택</h2>
        <div className="menu-buttons grid-selection">
          {stages[difficulty].map((stage) => (
            <button key={stage.id} className="btn-primary" onClick={() => onSelect(stage.solution)}>
              {stage.name}
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

export default StageMenu;