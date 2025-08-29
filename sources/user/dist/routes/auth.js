"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const userService_1 = require("../services/userService");
const google_auth_library_1 = require("google-auth-library");
const googleapis_1 = require("googleapis");
const userSchema_1 = require("../validations/userSchema");
const authService_1 = require("../services/authService");
const auth = async (fastify) => {
    const googleClient = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_OAUTH_ID, process.env.GOOGLE_OAUTH_SECRET, process.env.GOOGLE_OAUTH_URI);
    fastify.get("/google", async (request, reply) => {
        const url = googleClient.generateAuthUrl({
            access_type: "offline",
            scope: ["profile", "email"],
        });
        reply.send({ url });
    });
    fastify.get("/google/callback", async (request, reply) => {
        const { code } = request.query;
        try {
            const { tokens } = await googleClient.getToken(code);
            googleClient.setCredentials(tokens);
            const oauth2 = googleapis_1.google.oauth2({
                auth: googleClient,
                version: "v2",
            });
            const { data } = await oauth2.userinfo.get();
            const googleData = data;
            if (!data)
                return reply.status(500).send({ error: "Authentication failed" });
            const user = await (0, userService_1.googleSignIn)(googleData);
            if (user) {
                reply.redirect(process.env.FRONT_URL +
                    "/?token=" +
                    fastify.jwt.sign({ email: user.email }) +
                    "&id=" +
                    user.id);
            }
            else {
                reply.status(403).send({ error: "User not authorized" });
            }
        }
        catch (err) {
            console.error("Error during authentication:", err);
            reply.status(500).send({ error: "Authentication failed" });
        }
    });
    fastify.post("/register", { schema: userSchema_1.createSchema }, async (request, reply) => {
        const userData = request.body;
        const user = await (0, userService_1.createUser)(userData);
        if (!user)
            throw new Error("Fail to register user");
        const userAuth = (await (0, authService_1.getUserAuth)(user.name));
        await (0, authService_1.generate2FA)(userAuth);
        reply.send({ ...user });
    });
    fastify.post("/login", { schema: userSchema_1.authSchema }, async (request, reply) => {
        const { name, password } = request.body;
        const userAuth = (await (0, authService_1.getUserAuth)(name));
        if (!userAuth)
            throw Error("Pas trouve =(");
        const check = await (0, authService_1.authUser)(password, userAuth);
        if (!check)
            throw new Error("Invalid password");
        const user = await (0, userService_1.getUser)({ id: userAuth.id });
        if (!user)
            throw new Error("Couldn't find user.");
        if (userAuth.configuration.is2FA) {
            await (0, authService_1.generate2FA)(userAuth);
            reply.send({ ...user });
            return;
        }
        reply.send({ ...user, token: fastify.jwt.sign({ email: user.email }) });
    });
    fastify.post("/2FA", { schema: userSchema_1.auth2FASchema }, async (request, reply) => {
        const { code, name, type } = request.body;
        const userAuth = (await (0, authService_1.getUserAuth)(name));
        if (code === userAuth.configuration.code2FA) {
            userAuth.configuration.code2FA = "";
            await (0, authService_1.updateConfig)(userAuth.configuration);
            if (type === "REGISTER")
                await (0, userService_1.verifyUser)(userAuth.id);
            reply.send({ token: fastify.jwt.sign({ email: userAuth.email }) });
            return;
        }
        reply.status(403).send({ message: "Invalid 2FA code" });
    });
};
exports.default = auth;
