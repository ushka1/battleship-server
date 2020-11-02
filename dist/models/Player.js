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
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const settingUtils_1 = require("../utils/settingUtils");
const playerSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 15,
        minlength: 3,
    },
    socketId: {
        type: String,
        required: true,
    },
    room: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Room',
    },
    ships: [
        {
            id: String,
            size: Number,
            hp: Number,
        },
    ],
    board: [
        [
            {
                row: Number,
                col: Number,
                id: String,
                shipId: String,
                hit: Boolean,
            },
        ],
    ],
    boardDefault: Array,
    turnId: Number,
}, { autoCreate: true });
playerSchema.methods.setDefaults = function (board) {
    return __awaiter(this, void 0, void 0, function* () {
        this.boardDefault = board;
        yield this.save();
    });
};
playerSchema.methods.setNewGame = function () {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.boardDefault)
            throw new Error('An unexpected error occurred.');
        this.board = this.boardDefault;
        this.ships = settingUtils_1.shipsDefaultArray;
        yield this.save();
    });
};
playerSchema.methods.resetGame = function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield this.updateOne([
            { $unset: ['ships', 'board', 'boardDefault', 'room', 'turnId'] },
        ]);
    });
};
playerSchema.methods.handleHit = function (row, col) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.board) {
            throw new Error('An unexpected error occurred.');
        }
        if (this.board[row][col].hit) {
            return true;
        }
        let shipHitted = false;
        const shipId = this.board[row][col].shipId;
        if (shipId) {
            const ship = (_a = this.ships) === null || _a === void 0 ? void 0 : _a.find((ship) => ship.id === shipId);
            ship.hp--;
            if (ship.hp <= 0) {
                settingUtils_1.sunkShip(this.board, shipId);
            }
            shipHitted = true;
        }
        this.board[row][col].hit = true;
        yield this.save();
        return shipHitted;
    });
};
playerSchema.methods.hasShips = function () {
    const allShipsSunked = this.ships.reduce((acc, cur) => {
        if (acc && cur.hp <= 0) {
            return true;
        }
        else {
            return false;
        }
    }, true);
    return !allShipsSunked;
};
const Player = mongoose_1.model('Player', playerSchema);
Player.db.dropCollection('players', () => { });
exports.default = Player;
//# sourceMappingURL=Player.js.map