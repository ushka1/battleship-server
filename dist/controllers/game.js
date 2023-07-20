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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleGame = void 0;
var SocketManager_1 = require("../utils/SocketManager");
var turn_1 = require("./turn");
var Player_1 = __importDefault(require("../models/Player"));
var Room_1 = __importDefault(require("../models/Room"));
var handleGame = function (coords) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function () {
        var io, room, enemyId, enemy, playerSocket, enemySocket, shipHitted, enemyBoard, playerBoard, enemyHasShips, err_1, socketIds;
        var _this = this;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    io = SocketManager_1.SocketManager.getInstance().io;
                    return [4, Room_1.default.findById(this.roomId).exec()];
                case 1:
                    room = _c.sent();
                    _c.label = 2;
                case 2:
                    _c.trys.push([2, 8, , 10]);
                    if (!room || !io) {
                        throw new Error('An unexpected error occurred.');
                    }
                    if (room.turn !== this.turnId) {
                        return [2];
                    }
                    enemyId = room.players.find(function (id) { return id.toString() !== _this.playerId; });
                    return [4, Player_1.default.findById(enemyId).exec()];
                case 3:
                    enemy = _c.sent();
                    if (!enemy) {
                        throw new Error('An unexpected error occurred.');
                    }
                    playerSocket = this;
                    enemySocket = io.sockets.sockets.get(enemy.socketId);
                    return [4, enemy.handleHit(coords.row, coords.col)];
                case 4:
                    shipHitted = _c.sent();
                    enemyBoard = (_a = enemy.board) === null || _a === void 0 ? void 0 : _a.map(function (row) {
                        return row.map(function (_a) {
                            var id = _a.id, row = _a.row, col = _a.col, shipId = _a.shipId, hit = _a.hit;
                            return {
                                id: id,
                                row: row,
                                col: col,
                                shipId: !!(shipId && hit),
                                hit: hit,
                            };
                        });
                    });
                    playerBoard = (_b = enemy.board) === null || _b === void 0 ? void 0 : _b.map(function (row) {
                        return row.map(function (_a) {
                            var id = _a.id, row = _a.row, col = _a.col, shipId = _a.shipId, hit = _a.hit;
                            return {
                                id: id,
                                row: row,
                                col: col,
                                shipId: shipId,
                                hit: hit,
                            };
                        });
                    });
                    playerSocket.emit('game-controller', { enemyBoard: enemyBoard });
                    enemySocket.emit('game-controller', { playerBoard: playerBoard });
                    enemyHasShips = enemy.hasShips();
                    if (!enemyHasShips) {
                        playerSocket.emit('game-controller', { gameOver: { win: true } });
                        enemySocket.emit('game-controller', { gameOver: { win: false } });
                        return [2];
                    }
                    if (!shipHitted) return [3, 5];
                    playerSocket.emit('game-controller', { unlock: true });
                    return [3, 7];
                case 5: return [4, (0, turn_1.changeTurn)(this.roomId)];
                case 6:
                    _c.sent();
                    enemySocket.emit('game-controller', { unlock: true });
                    _c.label = 7;
                case 7: return [3, 10];
                case 8:
                    err_1 = _c.sent();
                    console.log(err_1);
                    console.error('Error in "controllers/game.ts [handleGame]".');
                    return [4, (room === null || room === void 0 ? void 0 : room.populate('players'))];
                case 9:
                    _c.sent();
                    socketIds = room === null || room === void 0 ? void 0 : room.players.map(function (player) { return player.socketId; });
                    socketIds === null || socketIds === void 0 ? void 0 : socketIds.forEach(function (socketId) {
                        var _a;
                        (_a = io.sockets.sockets.get(socketId)) === null || _a === void 0 ? void 0 : _a._error({
                            message: 'An unexpected error occurred.',
                        });
                    });
                    return [3, 10];
                case 10: return [2];
            }
        });
    });
};
exports.handleGame = handleGame;
//# sourceMappingURL=game.js.map