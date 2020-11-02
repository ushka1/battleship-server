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
exports.createPrivateRoom = void 0;
const Room_1 = __importDefault(require("../models/Room"));
const Player_1 = __importDefault(require("../models/Player"));
const reconnectionCleanup_1 = require("../utils/reconnectionCleanup");
exports.createPrivateRoom = function (roomId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield reconnectionCleanup_1.reconnectionCleanup(this);
            const player = yield Player_1.default.findById(this.playerId);
            if (!player) {
                throw new Error('Player not found.');
            }
            const privateRoom = yield Room_1.default.create({
                players: [],
                private: true,
                disabled: true,
            });
            privateRoom.addToRoom(player);
            this.join(privateRoom.id);
            this.roomId = privateRoom.id;
            const response = {
                message: `Congratulations ${player.name}, you successfully joined to the private room!`,
                roomId: privateRoom.id,
            };
            this.emit('private', response);
        }
        catch (err) {
            console.log('Error in "privateRoom.ts [createPrivateRoom]"');
        }
    });
};
//# sourceMappingURL=privateRoom.js.map