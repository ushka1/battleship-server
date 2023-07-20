"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.onConnect = void 0;
var Player_1 = __importDefault(require("../models/Player"));
var Room_1 = __importDefault(require("../models/Room"));
var SocketManager_1 = require("../utils/SocketManager");
var onConnect = function (name) {
    return __awaiter(this, void 0, void 0, function () {
        var player, response, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4, Player_1.default.create({ name: name, socketId: this.id })];
                case 1:
                    player = _a.sent();
                    response = {
                        message: "Congratulations ".concat(name, ", you successfully connected to our game!"),
                        player: { id: player.id, name: player.name },
                    };
                    this.playerId = player.id;
                    this.emit('connect-player', response);
                    this.on('disconnect', onDisconnect.bind(this));
                    return [3, 3];
                case 2:
                    err_1 = _a.sent();
                    console.error('Error in "controllers/connect.ts [onConnect]".');
                    this._error({ message: 'User connection fault.' });
                    return [3, 3];
                case 3: return [2];
            }
        });
    });
};
exports.onConnect = onConnect;
var onDisconnect = function () {
    return __awaiter(this, void 0, void 0, function () {
        var remainingPlayer, response, io, room, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 9, , 10]);
                    if (!this.playerId) return [3, 8];
                    if (!this.roomId) return [3, 6];
                    return [4, Player_1.default.findOne({
                            _id: { $ne: this.playerId },
                            room: this.roomId,
                        }).exec()];
                case 1:
                    remainingPlayer = _a.sent();
                    if (!remainingPlayer) return [3, 3];
                    return [4, remainingPlayer.setNewGame()];
                case 2:
                    _a.sent();
                    response = {
                        message: "Your enemy couldn't stand it, he/she disconnected.",
                        board: remainingPlayer.boardDefault,
                        playerLeft: true,
                    };
                    io = SocketManager_1.SocketManager.getInstance().io;
                    io.to(remainingPlayer.socketId).emit('disconnect', response);
                    _a.label = 3;
                case 3: return [4, Room_1.default.findById(this.roomId).exec()];
                case 4:
                    room = _a.sent();
                    return [4, (room === null || room === void 0 ? void 0 : room.removeFromRoom(this.playerId))];
                case 5:
                    _a.sent();
                    _a.label = 6;
                case 6: return [4, Player_1.default.deleteOne({ _id: this.playerId }).exec()];
                case 7:
                    _a.sent();
                    _a.label = 8;
                case 8: return [3, 10];
                case 9:
                    err_2 = _a.sent();
                    console.error(err_2);
                    return [3, 10];
                case 10: return [2];
            }
        });
    });
};
//# sourceMappingURL=connect.js.map