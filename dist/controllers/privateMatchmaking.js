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
exports.privateMatchmaking = void 0;
const Socket_1 = require("../utils/Socket");
const turn_1 = require("./turn");
const Room_1 = __importDefault(require("../models/Room"));
const Player_1 = __importDefault(require("../models/Player"));
exports.privateMatchmaking = function (roomId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const player = yield Player_1.default.findById(this.playerId);
            const room = yield Room_1.default.findById(roomId);
            if (!player || !room) {
                throw new Error('Your link has expired.');
            }
            if (room.players.includes(this.playerId)) {
                room.disabled = false;
            }
            else {
                if (room.players.length >= 2) {
                    throw new Error('The room is full.');
                }
                yield room.addToRoom(player);
                this.roomId = room.id;
                this.join(room.id);
            }
            yield room.save();
            yield player.setNewGame();
            if (room.players.length === 2 && !room.disabled) {
                const { io } = Socket_1.Socket.getInstance();
                io.in(room.id).emit('private-matchmaking', {
                    message: 'Congratulations to both players, room is ready to start a game!',
                    readyToPlay: true,
                });
                turn_1.setTurnIds(room.id);
            }
        }
        catch (err) {
            this.error({ message: err.message });
            console.log('Error in "controllers/privateMatchmaking.ts [privateMatchmaking]"');
        }
    });
};
//# sourceMappingURL=privateMatchmaking.js.map