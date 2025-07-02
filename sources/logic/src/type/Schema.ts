import { z } from "zod/v4";

export const schemaGetGame = {
  params: {
    type: "object",
    properties: {
      id: { type: "string" },
    },
  },
};

export const schemaCreateGame = {
  body: {
    type: "object",
    required: ["gameId", "playersId", "scoreMax"],
    properties: {
      gameId: { type: "string" },
      playersId: {
        type: "array",
        items: { type: "string" },
        minItems: 2,
      },
      scoreMax: { type: "number" },
    },
  },
};

export const schemaDeleteGame = {
  body: {
    type: "object",
    required: ["gameId"],
    properties: {
      gameId: { type: "string" },
    },
  },
};

export const schemaWebSocket = {
  params: {
    type: "object",
    required: ["gameId", "playerId"],
    properties: {
      gameId: { type: "string" },
      playerId: { type: "string" },
    },
  },
};

export const schemaWebSocketInput = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("input"),
    value: z.union([z.literal("up"), z.literal("down")]).nullable(),
  }),
  z.object({
    type: z.literal("pause"),
    value: z.union([
      z.literal("pause"),
      z.literal("unpause"),
      z.literal("flip"),
    ]),
  }),
]);

export type WebSocketMessage = z.infer<typeof schemaWebSocketInput>;
export type MessageTypes = {
  [T in WebSocketMessage as T["type"]]: T;
};
