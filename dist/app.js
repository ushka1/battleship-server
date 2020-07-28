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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = require("mongoose");
const socket_io_1 = __importDefault(require("socket.io"));
const socket_1 = require("./utils/socket");
const controllers_1 = __importDefault(require("./controllers"));
const app = express_1.default();
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@deck.rbvm5.mongodb.net/${process.env.DB_NAME}`, { useNewUrlParser: true, useUnifiedTopology: true });
    const server = app.listen(process.env.PORT || 5000);
    const io = socket_io_1.default.listen(server, { origins: ['http://localhost:3000'] });
    if (io) {
        socket_1.init(io);
        io.on('connect', controllers_1.default);
    }
}))();
//# sourceMappingURL=app.js.map