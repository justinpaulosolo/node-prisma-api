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
exports.startServer = exports.createServer = void 0;
const hapi_1 = __importDefault(require("@hapi/hapi"));
const prisma_1 = __importDefault(require("../plugins/prisma"));
const status_1 = __importDefault(require("../plugins/status"));
const server = hapi_1.default.server({
    port: process.env.PORT || 3000,
    host: process.env.HOST || "localhost",
});
function createServer() {
    return __awaiter(this, void 0, void 0, function* () {
        yield server.register([status_1.default, prisma_1.default]);
        yield server.initialize();
        return server;
    });
}
exports.createServer = createServer;
function startServer(server) {
    return __awaiter(this, void 0, void 0, function* () {
        yield server.start();
        console.log(`Server running at: ${server.info.uri}`);
        return server;
    });
}
exports.startServer = startServer;
process.on("unhandledRejection", (err) => {
    console.log(err);
    process.exit(1);
});
