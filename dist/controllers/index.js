"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connect_1 = require("./connect");
const matchmaking_1 = require("./matchmaking");
const setting_1 = require("./setting");
function default_1(socket) {
    socket.on('connect-player', connect_1.onConnect);
    socket.on('apply-setting', setting_1.applySetting);
    socket.on('matchmaking', matchmaking_1.matchmaking);
    socket.on('shit', () => {
        console.log('BOS!');
    });
}
exports.default = default_1;
//# sourceMappingURL=index.js.map