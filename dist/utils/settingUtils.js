"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sunkShip = exports.validateShipPosition = exports.shipsDefaultStateArr = exports.shipsDefaultState = exports.columns = exports.rows = void 0;
exports.rows = 10;
exports.columns = 10;
exports.shipsDefaultState = {
    'ship-0': { id: 'ship-0', size: 4, hp: 4 },
    'ship-2': { id: 'ship-2', size: 3, hp: 3 },
    'ship-1': { id: 'ship-1', size: 3, hp: 3 },
    'ship-3': { id: 'ship-3', size: 2, hp: 2 },
    'ship-4': { id: 'ship-4', size: 2, hp: 2 },
    'ship-5': { id: 'ship-5', size: 2, hp: 2 },
    'ship-6': { id: 'ship-6', size: 1, hp: 1 },
    'ship-7': { id: 'ship-7', size: 1, hp: 1 },
    'ship-8': { id: 'ship-8', size: 1, hp: 1 },
    'ship-9': { id: 'ship-9', size: 1, hp: 1 },
};
exports.shipsDefaultStateArr = Object.keys(exports.shipsDefaultState).map(function (key) {
    return __assign({}, exports.shipsDefaultState[key]);
});
function getShipOrientation(board, row, col, shipId) {
    var ship = exports.shipsDefaultState[shipId];
    if (ship.size === 1) {
        return 'horizontal';
    }
    else {
        if (board[row] &&
            board[row][col + 1] &&
            board[row][col + 1].shipId === shipId) {
            return 'horizontal';
        }
        else if (board[row + 1] &&
            board[row + 1][col] &&
            board[row + 1][col].shipId === shipId) {
            return 'vertical';
        }
        else {
            throw new Error('Invalid ship position.');
        }
    }
}
function validateShipPosition(board, row, col, shipId) {
    var ship = exports.shipsDefaultState[shipId];
    var orientation = getShipOrientation(board, row, col, shipId);
    if (orientation === 'horizontal') {
        if (row < 0 || row >= exports.rows)
            return false;
        if (col < 0 || col + ship.size - 1 >= exports.columns)
            return false;
        for (var i = col; i <= col + ship.size - 1; i++) {
            if (board[row][i].shipId !== shipId) {
                return false;
            }
        }
        for (var i = row - 1; i <= row + 1; i++) {
            for (var j = col - 1; j <= col + ship.size; j++) {
                if (board[i] &&
                    board[i][j] &&
                    board[i][j].shipId !== null &&
                    board[i][j].shipId !== shipId) {
                    return false;
                }
            }
        }
    }
    if (orientation === 'vertical') {
        if (row < 0 || row + ship.size - 1 >= exports.rows)
            return false;
        if (col < 0 || col >= exports.columns)
            return false;
        for (var i = row; i < row + ship.size; i++) {
            if (board[i][col].shipId !== shipId) {
                return false;
            }
        }
        for (var i = row - 1; i <= row + ship.size; i++) {
            for (var j = col - 1; j <= col + 1; j++) {
                if (board[i] &&
                    board[i][j] &&
                    board[i][j].shipId !== null &&
                    board[i][j].shipId !== shipId) {
                    return false;
                }
            }
        }
    }
    return true;
}
exports.validateShipPosition = validateShipPosition;
var sunkShip = function (board, shipId) {
    var ship = __assign({}, exports.shipsDefaultState[shipId]);
    var orientation;
    var firstCell;
    for (var _i = 0, board_1 = board; _i < board_1.length; _i++) {
        var row = board_1[_i];
        for (var _a = 0, row_1 = row; _a < row_1.length; _a++) {
            var cell = row_1[_a];
            if (cell.shipId === ship.id) {
                firstCell = cell;
                break;
            }
        }
        if (firstCell) {
            break;
        }
    }
    if (!firstCell) {
        return;
    }
    if (board[firstCell.row][firstCell.col + 1] &&
        board[firstCell.row][firstCell.col + 1].shipId === ship.id) {
        orientation = 'horizontal';
    }
    else {
        orientation = 'vertical';
    }
    if (orientation === 'horizontal') {
        var firstColumn = firstCell.col - 1;
        var lastColumn = firstCell.col + ship.size;
        var firstRow = firstCell.row - 1;
        var lastRow = firstCell.row + 1;
        for (var col = firstColumn; col < lastColumn + 1; col++) {
            for (var row = firstRow; row < lastRow + 1; row++) {
                if (board[row] && board[row][col]) {
                    board[row][col].hit = true;
                }
            }
        }
    }
    else if (orientation === 'vertical') {
        var firstRow = firstCell.row - 1;
        var lastRow = firstCell.row + ship.size;
        var firstColumn = firstCell.col - 1;
        var lastColumn = firstCell.col + 1;
        for (var row = firstRow; row < lastRow + 1; row++) {
            for (var col = firstColumn; col < lastColumn + 1; col++) {
                if (board[row] && board[row][col]) {
                    board[row][col].hit = true;
                }
            }
        }
    }
};
exports.sunkShip = sunkShip;
//# sourceMappingURL=settingUtils.js.map