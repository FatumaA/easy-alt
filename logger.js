const winston = require("winston");
const Sentry = require("@sentry/node");
const SentryTransport = require("winston-transport-sentry-node").default;

let nodeProfilingIntegration;
try {
	nodeProfilingIntegration =
		require("@sentry/profiling-node").nodeProfilingIntegration;
} catch (e) {
	console.error("Failed to load Sentry profiling integration:", e);
}

Sentry.init({
	dsn: process.env.SENTRY_DSN,
	integrations: nodeProfilingIntegration ? [nodeProfilingIntegration()] : [],
	tracesSampleRate: 1.0,
	profilesSampleRate: 1.0,
});

const logger = winston.createLogger({
	level: "info",
	format: winston.format.combine(
		winston.format.timestamp(),
		winston.format.json()
	),
	defaultMeta: { service: "easy-alt-extension" },
	transports: [
		new winston.transports.Console({
			format: winston.format.simple(),
		}),
		new winston.transports.File({ filename: "error.log", level: "error" }),
		new winston.transports.File({ filename: "combined.log" }),
		new SentryTransport({
			sentry: Sentry,
			level: "error",
		}),
	],
});

function sendToSentry(level, message, error) {
	if (level === "error") {
		Sentry.captureException(error);
	} else {
		Sentry.captureMessage(message);
	}
}

module.exports = {
	info: (message) => {
		logger.info(message);
		sendToSentry("info", message, null);
	},
	error: (message, error) => {
		logger.error(message, { error });
		sendToSentry("error", message, error);
	},
	logger: logger,
};
