"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.applySetting = void 0;
const Player_1 = __importDefault(require("../models/Player"));
const settingUtils_1 = require("../utils/settingUtils");
exports.applySetting = function (board) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const player = yield Player_1.default.findById(this.playerId);
            if (!player) {
                throw new Error('User connection fault.');
            }
            if (!board[settingUtils_1.rowsLength - 1] || !board[settingUtils_1.rowsLength - 1][settingUtils_1.colsLength - 1]) {
                throw new Error('User passed invalid setting.');
            }
            const foundShips = {};
            for (let row = 0; row < settingUtils_1.rowsLength; row++) {
                for (let col = 0; col < settingUtils_1.colsLength; col++) {
                    const curCell = board[row][col];
                    if (
                    // * IF CELL CONTAINS SHIPID AND SHIP IS NOT FOUND YET * //
                    settingUtils_1.shipsDefault[curCell.shipId] &&
                        foundShips[curCell.shipId] === undefined) {
                        foundShips[curCell.shipId] = settingUtils_1.shipProperlySettled(board, row, col, curCell.shipId);
                    }
                }
            }
            const settingValid = Object.keys(settingUtils_1.shipsDefault).reduce((acc, cur) => {
                if (!acc || !foundShips[cur])
                    return false;
                return true;
            }, true);
            if (!settingValid) {
                throw new Error('User passed invalid setting.');
            }
            const validatedBoard = board.map((row) => {
                return row.map((col) => (Object.assign(Object.assign({}, col), { hit: false })));
            });
            yield player.setDefaults(validatedBoard);
            const response = {
                message: `Congratulations ${player.name}, your setting is right!`,
                validatedBoard,
            };
            this.emit('apply-setting', response);
        }
        catch (err) {
            console.error('Error in "controllers/setting.ts [applySetting]".');
            this.error({ message: err.message || 'Setting Error.' });
        }
    });
};
//# sourceMappingURL=setting.js.map