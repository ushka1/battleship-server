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
exports.reconnectionCleanup = void 0;
const Room_1 = __importDefault(require("../models/Room"));
exports.reconnectionCleanup = (socket) => __awaiter(void 0, void 0, void 0, function* () {
    if (socket.roomId) {
        const room = yield Room_1.default.findById(socket.roomId);
        yield (room === null || room === void 0 ? void 0 : room.removeFromRoom(socket.playerId));
        socket.leave(socket.roomId);
        socket.roomId = undefined;
    }
});
//# sourceMappingURL=reconnectionCleanup.js.map