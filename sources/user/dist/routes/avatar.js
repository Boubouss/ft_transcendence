"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const stream_1 = require("stream");
const util_1 = require("util");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const userSchema_1 = require("../validations/userSchema");
const avatar = async (fastify, opts) => {
    fastify.addHook("preHandler", authMiddleware_1.authMiddleware);
    const pump = (0, util_1.promisify)(stream_1.pipeline);
    fastify.post("/upload/:id", async (request, reply) => {
        const { id } = request.params;
        try {
            const data = await request.file(userSchema_1.fileSchema);
            if (!data)
                throw new Error("No file =(");
            const uploadDir = path_1.default.join(path_1.default.dirname(__dirname), '../storage');
            if (!fs_1.default.existsSync(uploadDir)) {
                fs_1.default.mkdirSync(uploadDir);
            }
            const filePath = path_1.default.join(uploadDir, "avatar_" + id + ".jpg");
            await pump(data.file, fs_1.default.createWriteStream(filePath));
            reply.send({ status: 'File uploaded and saved successfully', filePath });
        }
        catch (err) {
            reply.send({ error: err.message });
        }
        return;
    });
};
exports.default = avatar;
