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
exports.onConnect = void 0;
const Socket_1 = require("../utils/Socket");
const Player_1 = __importDefault(require("../models/Player"));
const Room_1 = __importDefault(require("../models/Room"));
exports.onConnect = function (name) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const player = yield Player_1.default.create({ name, socketId: this.id });
            const response = {
                message: `Congratulations ${name}, you successfully connected to our game!`,
                player: { id: player.id, name: player.name },
            };
            this.playerId = player.id;
            this.emit('connect-player', response);
            this.on('disconnect', onDisconnect.bind(this));
        }
        catch (err) {
            console.error('Error in "controllers/connect.ts [onConnect]".');
            this.error({ message: 'User connection fault.' });
        }
    });
};
const onDisconnect = function () {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (this.playerId) {
                if (this.roomId) {
                    const remainingPlayer = yield Player_1.default.findOne({
                        _id: { $ne: this.playerId },
                        room: this.roomId,
                    });
                    if (remainingPlayer) {
                        yield remainingPlayer.setNewGame();
                        const response = {
                            message: "Your enemy couldn't stand it, he/she disconnected.",
                            board: remainingPlayer.boardDefault,
                            playerLeft: true,
                        };
                        const { io } = Socket_1.Socket.getInstance();
                        io.to(remainingPlayer.socketId).emit('disconnect', response);
                    }
                    const room = yield Room_1.default.findById(this.roomId);
                    yield (room === null || room === void 0 ? void 0 : room.removeFromRoom(this.playerId));
                }
                yield Player_1.default.deleteOne({ _id: this.playerId });
            }
        }
        catch (err) {
            console.error('Error in "controllers/connect.ts [onDisconnect]".');
        }
    });
};
//# sourceMappingURL=connect.js.map