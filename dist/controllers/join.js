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
exports.joinRoom = void 0;
const Player_1 = __importDefault(require("../models/Player"));
const Room_1 = __importDefault(require("../models/Room"));
exports.joinRoom = function () {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.roomId) {
            return;
        }
        try {
            const player = yield Player_1.default.findById(this.playerId);
            if (!player) {
                throw new Error('Player not found');
            }
            let room;
            room = yield Room_1.default.findOne({ players: { $size: 1 } });
            if (!room) {
                room = yield Room_1.default.create({ players: [] });
            }
            yield room.addToRoom(player);
            const response = {
                message: `Congratulations ${player.name}, you successfully joined to the room!`,
                player: player.toObject({ getters: true }),
            };
            this.roomId = room.id;
            this.join(room.id);
            this.emit('join-room', response);
        }
        catch (err) {
            this.error(err);
        }
    });
};
//# sourceMappingURL=join.js.map