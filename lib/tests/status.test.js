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
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("../utils/server");
describe("Status plugin", () => {
    let server;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        server = yield (0, server_1.createServer)();
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield server.stop();
    }));
    test("GET / returns 200", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield server.inject({
            method: "GET",
            url: "/",
        });
        expect(res.statusCode).toEqual(200);
        const response = JSON.parse(res.payload);
        expect(response.up).toEqual(true);
        expect(response.msg).toEqual("Hello");
    }));
});
