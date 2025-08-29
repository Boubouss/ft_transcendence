"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const userSchema_1 = require("../validations/userSchema");
const userService_1 = require("../services/userService");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const crud = async (fastify, opts) => {
    fastify.addHook("preHandler", authMiddleware_1.authMiddleware);
    fastify.get("/users", async () => {
        return (0, userService_1.getUsers)();
    });
    fastify.get("/user/:id", async (request, reply) => {
        const { id } = request.params;
        return (0, userService_1.getUser)({ id: parseInt(id) });
    });
    fastify.post("/user", { schema: userSchema_1.createSchema }, async (request, reply) => {
        const user = request.body;
        return (0, userService_1.createUser)(user);
    });
    fastify.put("/user/:id", { schema: userSchema_1.updateSchema }, async (request, reply) => {
        const { id } = request.params;
        const user = request.body;
        return (0, userService_1.updateUser)(parseInt(id), user);
    });
    fastify.delete("/user/:id", async (request, reply) => {
        const { id } = request.params;
        return (0, userService_1.deleteUser)(parseInt(id));
    });
    fastify.post("/players", { schema: userSchema_1.playersSchema }, async (request, reply) => {
        const { ids } = request.body;
        return (0, userService_1.getPlayers)(ids);
    });
};
exports.default = crud;
