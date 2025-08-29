"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketAuthMiddleware = exports.authMiddleware = void 0;
const authMiddleware = async (request, reply) => {
    try {
        await request.jwtVerify();
    }
    catch (err) {
        reply.send(err);
    }
};
exports.authMiddleware = authMiddleware;
const socketAuthMiddleware = async (token, api) => {
    try {
        if (!token)
            return false;
        api.jwt.verify(token);
        return true;
    }
    catch (err) {
        return false;
    }
};
exports.socketAuthMiddleware = socketAuthMiddleware;
