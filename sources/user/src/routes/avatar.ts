import { FastifyPluginAsync } from "fastify";
import { pipeline } from "stream";
import { promisify } from "util";
import fs from "fs";
import path from "path";
import { authMiddleware } from "../middlewares/authMiddleware";
import { fileSchema } from "../validations/userSchema";

const avatar: FastifyPluginAsync = async (fastify, opts) => {
    fastify.addHook("preHandler", authMiddleware);

    const pump = promisify(pipeline);

    fastify.post("/upload/:id", async (request, reply) => {
        const { id } = request.params as { id: string };

        try {
            const data = await request.file(fileSchema);

            if (!data)
                throw new Error("No file =(");

            const uploadDir = path.join(path.dirname(__dirname), '../storage');
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir);
            }

            const filePath = path.join(uploadDir, "avatar_" + id + ".jpg");

            await pump(data.file, fs.createWriteStream(filePath));

            reply.send({ status: 'File uploaded and saved successfully', filePath });
        } catch (err: any) {
            reply.send({ error: err.message });
        }
        return;
    });

    
};

export default avatar;
