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
exports.handleGame = void 0;
const Player_1 = __importDefault(require("../models/Player"));
const Room_1 = __importDefault(require("../models/Room"));
const turn_1 = require("./turn");
const socket_1 = require("../utils/socket");
exports.handleGame = function (coords) {
    return __awaiter(this, void 0, void 0, function* () {
        const io = socket_1.getIO();
        const room = yield Room_1.default.findById(this.roomId);
        try {
            if (!room || !io) {
                throw new Error('An unexpected error occurred.');
            }
            if (room.turn !== this.turnId) {
                return;
            }
            const enemyId = room.players.find((id) => id.toString() !== this.playerId);
            const enemy = yield Player_1.default.findById(enemyId);
            if (!enemy) {
                throw new Error('An unexpected error occurred.');
            }
            const playerSocket = this;
            const enemySocket = io.sockets.connected[enemy.socketId];
            const shipHitted = yield enemy.handleHit(coords.row, coords.col);
            playerSocket.emit('game-controller', { enemyBoard: enemy.board });
            enemySocket.emit('game-controller', { playerBoard: enemy.board });
            if (shipHitted) {
                playerSocket.emit('game-controller', { unlock: true });
            }
            else {
                yield turn_1.changeTurn(this.roomId);
                enemySocket.emit('game-controller', { unlock: true });
            }
        }
        catch (err) {
            console.error('Error in "controllers/game.ts [handleGame]".');
            yield (room === null || room === void 0 ? void 0 : room.populate('players').execPopulate());
            const socketIds = room === null || room === void 0 ? void 0 : room.players.map((player) => player.socketId);
            socketIds === null || socketIds === void 0 ? void 0 : socketIds.forEach((socketId) => {
                io === null || io === void 0 ? void 0 : io.sockets.connected[socketId].error({
                    message: 'An unexpected error occurred.',
                });
            });
        }
    });
};
//# sourceMappingURL=game.js.map