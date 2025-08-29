"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const fastify_1 = __importDefault(require("fastify"));
const jwt_1 = __importDefault(require("@fastify/jwt"));
const static_1 = __importDefault(require("@fastify/static"));
const multipart_1 = __importDefault(require("@fastify/multipart"));
const crud_1 = __importDefault(require("./routes/crud"));
const auth_1 = __importDefault(require("./routes/auth"));
const socket_1 = __importDefault(require("./routes/socket"));
const errorHandler_1 = require("./errors/errorHandler");
const websocket_1 = __importDefault(require("@fastify/websocket"));
const cors_1 = __importDefault(require("@fastify/cors"));
const avatar_1 = __importDefault(require("./routes/avatar"));
// dotenv.config({ path: path.resolve(__dirname, "../.env") });
// checkEnv();
const app = (0, fastify_1.default)({
    https: {
        key: fs_1.default.readFileSync(process.env.HTTPS_KEY),
        cert: fs_1.default.readFileSync(process.env.HTTPS_CERT),
    },
});
app.register(static_1.default, {
    root: path_1.default.join(path_1.default.dirname(__dirname), "storage"),
    prefix: "/download/",
});
app.register(cors_1.default, {
    origin: process.env.FRONT_URL,
    optionsSuccessStatus: 200,
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
    preflightContinue: false,
});
app.register(websocket_1.default);
app.register(jwt_1.default, {
    secret: process.env.JWT_KEY,
});
app.register(multipart_1.default);
app.register(crud_1.default, { prefix: "/crud" });
app.register(auth_1.default, { prefix: "/auth" });
app.register(socket_1.default, { prefix: "/socket" });
app.register(avatar_1.default, { prefix: "/avatar" });
app.setErrorHandler(errorHandler_1.errorHandler);
const start = async () => {
    try {
        await app.listen({ port: 3000, host: "0.0.0.0" });
        console.log("Server is running on https://localhost:3000");
    }
    catch (err) {
        app.log.error(err);
        console.log(err);
        process.exit(1);
    }
};
start();
