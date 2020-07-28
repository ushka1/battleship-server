"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startSockets = void 0;
const socket_1 = require("../utils/socket");
const connect_1 = require("../controllers/connect");
function startSockets() {
    const io = socket_1.getIO();
    io.on('connect', connect_1.onConnect);
}
exports.startSockets = startSockets;
//# sourceMappingURL=index.js.map