"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applySetting = void 0;
const ships = {
    'ship-0': { size: 4 },
    'ship-2': { size: 3 },
    'ship-1': { size: 3 },
    'ship-3': { size: 2 },
    'ship-4': { size: 2 },
    'ship-5': { size: 2 },
    'ship-6': { size: 1 },
    'ship-7': { size: 1 },
    'ship-8': { size: 1 },
    'ship-9': { size: 1 },
};
exports.applySetting = function (board) {
    try {
        if (!board[9] || !board[9][9]) {
            throw new Error('User passed invalid input');
        }
        const foundShips = {};
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                const curCell = board[i][j];
                if (ships[curCell.shipId] && foundShips[curCell.shipId] === undefined) {
                    foundShips[curCell.shipId] = shipProperlySettled(curCell.shipId, board, i, j);
                }
            }
        }
        const settingValid = Object.keys(ships).reduce((acc, cur) => {
            if (!acc || !foundShips[cur])
                return false;
            return true;
        }, true);
        if (!settingValid) {
            throw new Error('User passed invalid input');
        }
        const response = {
            message: 'Congratulations, your input is RIGHT !',
        };
        this.emit('apply-setting', response);
    }
    catch (err) {
        this.error({ message: err.message });
    }
};
const shipProperlySettled = (shipId, board, i, j) => {
    const ship = ships[shipId];
    let orientation = '';
    if (ship.size === 1) {
        orientation = 'horizontal';
    }
    else {
        if (board[i][j + 1] && board[i][j + 1].shipId === shipId) {
            orientation = 'horizontal';
        }
        else if (board[i + 1][j].shipId === shipId) {
            orientation = 'vertical';
        }
        else {
            return false;
        }
    }
    if (orientation === 'horizontal') {
        for (let k = j; k < ship.size + j; k++) {
            if (!board[i][k] || board[i][k].shipId !== shipId) {
                return false;
            }
        }
        for (let k = i - 1; k < i + 2; k++) {
            for (let l = j - 1; l < j + ship.size + 1; l++) {
                if (board[k] &&
                    board[k][l] &&
                    board[k][l].shipId !== null &&
                    board[k] &&
                    board[k][l] &&
                    board[k][l].shipId !== shipId) {
                    return false;
                }
            }
        }
    }
    else if (orientation === 'vertical') {
        for (let k = i; k < i + ship.size; k++) {
            if (!board[k] || !board[k][j] || board[k][j].shipId !== shipId) {
                return false;
            }
        }
        for (let k = i - 1; k < i + ship.size + 1; k++) {
            for (let l = j - 1; l < j + 2; l++) {
                if (board[k] &&
                    board[k][l] &&
                    board[k][l].shipId !== shipId &&
                    board[k][l].shipId !== null) {
                    return false;
                }
            }
        }
    }
    return true;
};
//# sourceMappingURL=setting.js.map