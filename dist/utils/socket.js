"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Socket = void 0;
var Socket = (function () {
    function Socket(io) {
        this.io = io;
    }
    Socket.init = function (io) {
        this.instance = new this(io);
    };
    Socket.getInstance = function () {
        if (this.instance) {
            return this.instance;
        }
        else {
            throw new Error('Error in "utils/socket.ts [getIO]".');
        }
    };
    return Socket;
}());
exports.Socket = Socket;
//# sourceMappingURL=Socket.js.map