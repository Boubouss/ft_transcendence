"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.playersSchema = exports.fileSchema = exports.auth2FASchema = exports.authSchema = exports.updateSchema = exports.configSchema = exports.createSchema = void 0;
exports.createSchema = {
    body: {
        type: "object",
        required: ["name", "email", "password"],
        properties: {
            id: { type: "integer" },
            name: { type: "string", minLength: 3, maxLength: 20 },
            email: { type: "string", format: "email" },
            avatar: { type: "string" },
            password: {
                type: "string",
                minLength: 8,
                pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
            },
        },
        additionalProperties: false,
    },
};
exports.configSchema = {
    type: "object",
    properties: {
        id: { type: "number" },
        is2FA: { type: "boolean" },
    },
    additionalProperties: false,
};
exports.updateSchema = {
    body: {
        type: "object",
        required: ["id", "configuration"],
        properties: {
            id: { type: "integer" },
            name: { type: "string", minLength: 3, maxLength: 20 },
            email: { type: "string", format: "email" },
            avatar: { type: "string" },
            password: {
                type: "string",
                minLength: 8,
                pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
            },
            configuration: exports.configSchema,
        },
        additionalProperties: false,
    },
};
exports.authSchema = {
    body: {
        type: "object",
        required: ["name", "password"],
        properties: {
            name: { type: "string", minLength: 3, maxLength: 20 },
            password: {
                type: "string",
                minLength: 8,
                pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
            },
        },
        additionalProperties: false,
    },
};
exports.auth2FASchema = {
    body: {
        type: "object",
        required: ["code", "name"],
        properties: {
            code: { type: "string" },
            name: { type: "string" },
            type: { type: "string" },
        },
        additionalProperties: false,
    },
};
exports.fileSchema = {
    file: {
        type: "object",
        properties: {
            filename: { type: "string" },
            mimetype: { type: "string" },
        },
        required: ["filename", "mimetype"],
    },
};
exports.playersSchema = {
    body: {
        type: "object",
        properties: {
            ids: { type: "array", items: { type: "number" } },
        },
        required: ["ids"],
    },
};
