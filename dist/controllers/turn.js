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
exports.setTurnIds = void 0;
const Room_1 = __importDefault(require("../models/Room"));
const socket_1 = require("../utils/socket");
exports.setTurnIds = (roomId) => __awaiter(void 0, void 0, void 0, function* () {
    const io = socket_1.getIO();
    const room = yield Room_1.default.findById(roomId);
    if (!room) {
        io.in(roomId).emit('turn-controller', {
            message: 'An unexpected error occurred.',
            error: 1,
        });
        return;
    }
    yield room.populate('players').execPopulate();
    room.players.forEach((player, idx) => __awaiter(void 0, void 0, void 0, function* () {
        player.turn = idx + 1;
        yield player.save();
        io.to(player.socketId).emit('turn-controller', {
            message: `Congratulations ${player.name}, your turnId is: ${idx + 1}!`,
            turnId: idx + 1,
        });
    }));
});
//# sourceMappingURL=turn.js.map