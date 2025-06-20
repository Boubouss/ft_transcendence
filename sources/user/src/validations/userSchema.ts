export const createSchema = {
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
				pattern:
					"^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
			},
		},
		additionalProperties: false,
	},
};

export const configSchema = {
	type: "object",
	properties: {
		id: { type: "number" },
		is2FA: { type: "boolean" },
	},
	additionalProperties: false,
};

export const updateSchema = {
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
				pattern:
					"^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
			},
			configuration: configSchema,
		},
		additionalProperties: false,
	},
};

export const authSchema = {
	body: {
		type: "object",
		required: ["name", "password"],
		properties: {
			name: { type: "string", minLength: 3, maxLength: 20 },
			password: {
				type: "string",
				minLength: 8,
				pattern:
					"^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
			},
		},
		additionalProperties: false,
	},
};

export const auth2FASchema = {
	body: {
		type: "object",
		required: ["code", "name"],
		properties: {
			code: { type: "string" },
			email: { type: "string", format: "email" },
		},
		additionalProperties: false,
	},
};

export const fileSchema = {
  file: {
    type: 'object',
    properties: {
      filename: { type: 'string' },
      mimetype: { type: 'string' }
    },
    required: ['filename', 'mimetype']
  }
};