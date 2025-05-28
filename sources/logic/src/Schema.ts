export const schemaCreateGame = {
  body: {
    type: "object",
    required: ["gameId", "playersId"],
    properties: {
      gameId: { type: "string" },
      playersId: {
        type: "array",
        items: { type: "string" },
        minItems: 2,
      },
    },
  },
};

export const schemaWebsocket = {
  params: {
    type: "object",
    required: ["gameId", "playerId"],
    properties: {
      gameId: { type: "string" },
      playerId: { type: "string" },
    },
  },
};
