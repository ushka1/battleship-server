"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const playerSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 15,
        minlength: 3,
    },
    socketId: {
        type: String,
        required: true,
    },
    room: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Room',
    },
    board: {
        type: Array,
    },
    turn: {
        type: Number,
    },
}, { autoCreate: true });
const Player = mongoose_1.model('Player', playerSchema);
Player.db.dropCollection('players', () => { });
exports.default = Player;
//# sourceMappingURL=Player.js.map