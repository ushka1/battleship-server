"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIO = exports.init = void 0;
let io;
function init(ioServer) {
    if (io) {
        return;
    }
    else {
        io = ioServer;
    }
}
exports.init = init;
function getIO() {
    if (io) {
        return io;
    }
    else {
        throw new Error('Error in "utils/socket.ts [getIO]".');
    }
}
exports.getIO = getIO;
//# sourceMappingURL=socket.js.map