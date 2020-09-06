"use strict";
//* Room._id === Socket.io room.id
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const roomSchema = new mongoose_1.Schema({
    players: {
        type: [
            {
                type: mongoose_1.Schema.Types.ObjectId,
                required: true,
                ref: 'Player',
            },
        ],
        required: true,
    },
    disabled: {
        type: Boolean,
    },
}, { autoCreate: true });
// tslint:disable-next-line: only-arrow-functions
roomSchema.methods.addToRoom = function (player) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.players.length >= 2) {
            throw new Error('The room is full.');
        }
        this.players.push(player.id);
        player.room = this.id;
        try {
            //**************************************************
            //**************************************************
            //**************************************************
            // const session = await startSession();
            // session.startTransaction();
            // await this.save({ session });
            // await player.save({ session });
            // await session.commitTransaction();
            // session.endSession();
            //**************************************************
            //**************************************************
            //**************************************************
            yield this.save();
            yield player.save();
        }
        catch (err) {
            throw new Error('An unexpected error occurred.');
        }
    });
};
roomSchema.methods.removeFromRoom = function (playerId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.players.length <= 1) {
            yield this.remove();
            return;
        }
        const updatedPlayers = this.players.filter((id) => id.toString() !== playerId.toString());
        this.players = updatedPlayers;
        this.disabled = true;
        yield this.save();
    });
};
const Room = mongoose_1.model('Room', roomSchema);
Room.db.dropCollection('rooms', () => { });
exports.default = Room;
//# sourceMappingURL=Room.js.map