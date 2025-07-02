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

export const schemeWebSocketInput = z.object({
  input: z.nullable(z.literal(["up", "down"])),
});
