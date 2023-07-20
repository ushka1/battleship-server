"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var connect_1 = require("../controllers/connect");
var game_1 = require("../controllers/game");
var matchmaking_1 = require("../controllers/matchmaking");
var privateMatchmaking_1 = require("../controllers/privateMatchmaking");
var privateRoom_1 = require("../controllers/privateRoom");
var setting_1 = require("../controllers/setting");
var turn_1 = require("../controllers/turn");
function default_1(socket) {
    socket.on('connect-player', connect_1.onConnect);
    socket.on('private', privateRoom_1.createPrivateRoom);
    socket.on('apply-setting', setting_1.applySetting);
    socket.on('matchmaking', matchmaking_1.matchmaking);
    socket.on('private-matchmaking', privateMatchmaking_1.privateMatchmaking);
    socket.on('turn-controller', turn_1.getTurnId);
    socket.on('game-controller', game_1.handleGame);
}
exports.default = default_1;
//# sourceMappingURL=index.js.map