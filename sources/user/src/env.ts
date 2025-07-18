export function checkEnv() {
	const requiredEnvVars = [
		"JWT_KEY",
		"HTTPS_KEY",
		"HTTPS_CERT",
		"MAILER_ADDR",
		"MAILER_PSWD",
		"GOOGLE_OAUTH_ID",
		"GOOGLE_OAUTH_SECRET",
		"GOOGLE_OAUTH_URI",
		"FRONT_URL",
	];

	const missingEnvVars = requiredEnvVars.filter(
		(varName) => !(varName in process.env)
	);

	if (missingEnvVars.length > 0) {
		console.error("Missing environment variables:", missingEnvVars.join(", "));
		process.exit(1);
	}
}
