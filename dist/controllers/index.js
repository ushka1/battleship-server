"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connect_1 = require("./connect");
const join_1 = require("./join");
function default_1(socket) {
    socket.on('connect-player', connect_1.onConnect);
    socket.on('join-room', join_1.joinRoom);
}
exports.default = default_1;
//# sourceMappingURL=index.js.map