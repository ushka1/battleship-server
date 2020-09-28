"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connect_1 = require("./connect");
const matchmaking_1 = require("./matchmaking");
const setting_1 = require("./setting");
const turn_1 = require("./turn");
const game_1 = require("./game");
function default_1(socket) {
    socket.on('connect-player', connect_1.onConnect);
    socket.on('apply-setting', setting_1.applySetting);
    socket.on('matchmaking', matchmaking_1.matchmaking);
    socket.on('turn-controller', turn_1.getTurnId);
    socket.on('game-controller', game_1.handleGame);
}
exports.default = default_1;
//# sourceMappingURL=index.js.map