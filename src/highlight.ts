// import * as path from "path";
// import * as dotenv from "dotenv";
// import type { LoggerOptions } from "pino";
// import pino from "pino";
// import type { NodeOptions } from "@highlight-run/node";

// dotenv.config({ path: path.join(__dirname, "../.env") });

// const highlightConfig = {
// 	projectID: process.env.HIGHLIGHT_PROJECT_ID!,
// 	serviceName: "easy-alt",
// 	serviceVersion: "0.0.4",
// 	environment: "production",
// } as NodeOptions;

// const pinoConfig = {
// 	level: "debug",
// 	transport: {
// 		target: "@highlight-run/pino",
// 		options: highlightConfig,
// 	},
// } as LoggerOptions;

// if (
// 	typeof process.env.NEXT_RUNTIME === "undefined" ||
// 	process.env.NEXT_RUNTIME === "nodejs"
// ) {
// 	const { H } = require("@highlight-run/node");
// 	H.init(highlightConfig);
// }

// export const logger = pino(pinoConfig);
