import React from 'react';

const Cell = React.memo(({ r, c, value, onMouseDown, onMouseEnter }) => {
  // value에 따른 상태 정의
  // 0: 빈칸, 1: 색칠(filled), 2: X표시(marked)
  
  const getClassName = () => {
    let base = 'cell';
    if (value === 1) base += ' filled';
    if (value === 2) base += ' marked';
    return base;
  };

  return (
    <div
      className={`cell ${value === 1 ? 'filled' : value === 2 ? 'marked' : ''}`}
      onClick={(e) => onClick(r, c, e)}
      onContextMenu={(e) => onClick(r, c, e)}
      onMouseDown={(e) => onMouseDown(r, c, e)}
      onMouseEnter={() => onMouseEnter(r, c)}
    >
      {value === 2 && 'X'}
    </div>
  );
});

// 성능 최적화를 위해 React.memo 사용 권장
export default React.memo(Cell);