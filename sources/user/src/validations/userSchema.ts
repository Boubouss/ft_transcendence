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

export const updateSchema = {
	body: {
		type: "object",
		required: ["name", "email"],
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
