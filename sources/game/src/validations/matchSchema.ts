export const matchCreateSchema = {
  body: {
    type: "object",
    required: ["user_ids"],
    properties: {
      user_ids: { type: "array", items: { type: "integer" } },
    },
    additionalProperties: false,
  },
};

export const matchUpdateSchema = {
  body: {
    type: "object",
    required: ["infos", "winner_id"],
    properties: {
      winner_id: { type: "number" },
      infos: {
        type: "array",
        minItems: 1,
        items: {
          type: "object",
          properties: {
            player_id: { type: "integer" },
            score: { type: "integer" },
          }
        }
      }
    },
    additionalProperties: false,
  },
};
