"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Socket = void 0;
class Socket {
    constructor(io) {
        this.io = io;
    }
    static init(io) {
        this.instance = new this(io);
    }
    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        else {
            throw new Error('Error in "utils/socket.ts [getIO]".');
        }
    }
}
exports.Socket = Socket;
//# sourceMappingURL=Socket.js.map