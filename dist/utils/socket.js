"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketManager = void 0;
var SocketManager = (function () {
    function SocketManager(io) {
        this.io = io;
    }
    SocketManager.init = function (io) {
        this.instance = new this(io);
        return this.instance;
    };
    SocketManager.getInstance = function () {
        if (this.instance) {
            return this.instance;
        }
        throw new Error('Socket instance not initialized.');
    };
    return SocketManager;
}());
exports.SocketManager = SocketManager;
//# sourceMappingURL=socket.js.map