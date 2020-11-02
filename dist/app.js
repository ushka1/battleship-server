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
const socket_io_1 = __importDefault(require("socket.io"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = require("mongoose");
const Socket_1 = require("./utils/Socket");
const routes_1 = __importDefault(require("./routes"));
const app = express_1.default();
app.use(cors_1.default({ origin: ['https://batiuszkamaroz.github.io/BATTLESHIP_CLIENT/'] }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.connect(`${process.env.DB_CONNECT}/${process.env.DB_NAME}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        auth: {
            password: `${process.env.DB_PASSWORD}`,
            user: `${process.env.DB_USERNAME}`,
        },
        dbName: `${process.env.DB_NAME}`,
    });
    const server = app.listen(process.env.PORT || 5000);
    const io = socket_io_1.default.listen(server, { origins: [process.env.SOCKET_ORIGIN] });
    if (io) {
        Socket_1.Socket.init(io);
        io.on('connect', routes_1.default);
    }
}))();
//# sourceMappingURL=app.js.map