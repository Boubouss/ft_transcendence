export function checkEnv() {
	const requiredEnvVars = [
		"JWT_KEY",
		"HTTPS_KEY",
		"HTTPS_CERT",
		"API_USER",
		"API_LOGIC",
	];

	const missingEnvVars = requiredEnvVars.filter(
		(varName) => !(varName in process.env)
	);

	if (missingEnvVars.length > 0) {
		console.error("Missing environment variables:", missingEnvVars.join(", "));
		process.exit(1);
	}
}
