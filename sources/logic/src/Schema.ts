export const schemaCreateGame = {
  body: {
    type: "object",
    required: ["gameId", "playersId"],
    properties: {
      gameId: { type: "string" },
      playersId: {
        type: "object",
        minProperties: 2,
        additionalProperties: { type: "string" },
      },
    },
  },
};

export const schemaWebsocket = {
  querystring: {
    properties: { gameId: { type: "string" }, playerId: { type: "string" } },
  },
};
