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
const Player_1 = __importDefault(require("../models/Player"));
const Room_1 = __importDefault(require("../models/Room"));
exports.onConnect = function (name) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.playerId) {
            return;
        }
        try {
            const player = yield Player_1.default.create({ name });
            const transformedPlayer = { id: player.id, name: player.name };
            const response = {
                message: `Congratulations ${name}, you successfully connected to our game!`,
                player: transformedPlayer,
            };
            this.emit('connect-player', response);
            this.playerId = player.id;
            this.on('disconnect', onDisconnect.bind(this));
        }
        catch (err) {
            console.log(err);
            this.error({ message: 'User passed invalid input' });
        }
    });
};
const onDisconnect = function () {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.playerId) {
            const player = yield Player_1.default.findById(this.playerId);
            if (this.roomId) {
                const response = {
                    message: 'Player left your room.',
                    playerLeft: true,
                };
                this.to(this.roomId).emit('matchmaking', response);
            }
            if (player === null || player === void 0 ? void 0 : player.room) {
                const room = yield Room_1.default.findById(player.room);
                if (room) {
                    yield room.removeFromRoom(player.id);
                }
            }
            yield (player === null || player === void 0 ? void 0 : player.remove());
        }
    });
};
//# sourceMappingURL=connect.js.map