"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIO = exports.init = void 0;
let io;
function init(ioServer) {
    io = ioServer;
}
exports.init = init;
function getIO() {
    return io;
}
exports.getIO = getIO;
//# sourceMappingURL=socket.js.map