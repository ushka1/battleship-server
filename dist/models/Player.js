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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var settingUtils_1 = require("../utils/settingUtils");
var playerSchema = new mongoose_1.Schema({
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
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    this.boardDefault = board;
                    return [4, this.save()];
                case 1:
                    _a.sent();
                    return [2];
            }
        });
    });
};
playerSchema.methods.setNewGame = function () {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!this.boardDefault)
                        throw new Error('An unexpected error occurred.');
                    this.board = this.boardDefault;
                    this.ships = settingUtils_1.shipsDefaultArray;
                    return [4, this.save()];
                case 1:
                    _a.sent();
                    return [2];
            }
        });
    });
};
playerSchema.methods.resetGame = function () {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, this.updateOne([
                        { $unset: ['ships', 'board', 'boardDefault', 'room', 'turnId'] },
                    ])];
                case 1:
                    _a.sent();
                    return [2];
            }
        });
    });
};
playerSchema.methods.handleHit = function (row, col) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var shipHitted, shipId, ship;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!this.board) {
                        throw new Error('An unexpected error occurred.');
                    }
                    if (this.board[row][col].hit) {
                        return [2, true];
                    }
                    shipHitted = false;
                    shipId = this.board[row][col].shipId;
                    if (shipId) {
                        ship = (_a = this.ships) === null || _a === void 0 ? void 0 : _a.find(function (ship) { return ship.id === shipId; });
                        ship.hp--;
                        if (ship.hp <= 0) {
                            settingUtils_1.sunkShip(this.board, shipId);
                        }
                        shipHitted = true;
                    }
                    this.board[row][col].hit = true;
                    return [4, this.save()];
                case 1:
                    _b.sent();
                    return [2, shipHitted];
            }
        });
    });
};
playerSchema.methods.hasShips = function () {
    var allShipsSunked = this.ships.reduce(function (acc, cur) {
        if (acc && cur.hp <= 0) {
            return true;
        }
        else {
            return false;
        }
    }, true);
    return !allShipsSunked;
};
var Player = mongoose_1.model('Player', playerSchema);
Player.db.dropCollection('players', function () { });
exports.default = Player;
//# sourceMappingURL=Player.js.map