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
exports.privateMatchmaking = void 0;
var SocketManager_1 = require("../utils/SocketManager");
var Player_1 = __importDefault(require("../models/Player"));
var Room_1 = __importDefault(require("../models/Room"));
var errors_1 = require("../utils/errors");
var turn_1 = require("./turn");
var privateMatchmaking = function (roomId) {
    return __awaiter(this, void 0, void 0, function () {
        var player, room, io, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 10, , 11]);
                    return [4, Player_1.default.findById(this.playerId)];
                case 1:
                    player = _a.sent();
                    return [4, Room_1.default.findById(roomId)];
                case 2:
                    room = _a.sent();
                    if (!player || !room) {
                        throw new Error('Your link has expired.');
                    }
                    if (!room.players.includes(this.playerId)) return [3, 3];
                    room.disabled = false;
                    return [3, 5];
                case 3:
                    if (room.players.length >= 2) {
                        throw new Error('The room is full.');
                    }
                    return [4, room.addToRoom(player)];
                case 4:
                    _a.sent();
                    this.roomId = room.id;
                    this.join(room.id);
                    _a.label = 5;
                case 5: return [4, room.save()];
                case 6:
                    _a.sent();
                    return [4, player.setNewGame()];
                case 7:
                    _a.sent();
                    if (!(room.players.length === 2 && !room.disabled)) return [3, 9];
                    io = SocketManager_1.SocketManager.getInstance().io;
                    return [4, (0, turn_1.setTurnIds)(room.id)];
                case 8:
                    _a.sent();
                    io.in(room.id).emit('private-matchmaking', {
                        message: 'Congratulations to both players, room is ready to start a game!',
                        readyToPlay: true,
                    });
                    _a.label = 9;
                case 9: return [3, 11];
                case 10:
                    err_1 = _a.sent();
                    this._error({ message: (0, errors_1.getErrorMessage)(err_1) });
                    console.log('Error in "controllers/privateMatchmaking.ts [privateMatchmaking]"');
                    return [3, 11];
                case 11: return [2];
            }
        });
    });
};
exports.privateMatchmaking = privateMatchmaking;
//# sourceMappingURL=privateMatchmaking.js.map