// utils.js
export const getHints = (arr) => {
    const hints = [];
    let count = 0;
    
    arr.forEach((val) => {
        if (val === 1) count++;
        else if (count > 0) {
        hints.push(count);
        count = 0;
        }
    });
    
    if (count > 0) hints.push(count);
    return hints.length ? hints : [0];
};

export const checkWin = (grid, solution) => {
    // 유저의 색칠(1)이 정답의 색칠(1)과 정확히 일치하는지 확인
    // X(2)는 빈칸(0)과 동일하게 취급하여 비교
    return grid.every((row, r) =>
        row.every((cell, c) => {
        const userValue = cell === 1 ? 1 : 0;
        return userValue === solution[r][c];
        })
    );
};