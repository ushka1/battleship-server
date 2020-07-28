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
    room: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Room',
    },
}, { autoCreate: true });
exports.default = mongoose_1.model('Player', playerSchema);
//# sourceMappingURL=Player.js.map