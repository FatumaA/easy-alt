const esbuild = require("esbuild");
const path = require("path");

const production = process.argv.includes("--production");
const watch = process.argv.includes("--watch");

const envPath = path.resolve(__dirname, "./.env");
require("dotenv").config({ path: envPath });

const esbuildProblemMatcherPlugin = {
	name: "esbuild-problem-matcher",
	setup(build) {
		build.onStart(() => {
			console.info("[watch] build started");
		});
		build.onEnd((result) => {
			result.errors.forEach(({ text, location }) => {
				console.error(`✘ [ERROR] ${text}`, {
					file: location.file,
					line: location.line,
					column: location.column,
				});
			});
			console.info("[watch] build finished");
		});
	},
};

async function main() {
	try {
		const ctx = await esbuild.context({
			entryPoints: ["src/extension.ts"],
			bundle: true,
			outfile: "dist/extension.js",
			external: ["vscode"],
			platform: "node",
			format: "cjs",
			sourcemap: true,
			minify: production,
			plugins: [esbuildProblemMatcherPlugin],
			loader: {
				".node": "file",
			},
			external: ["vscode", "*.node"],
		});

		if (watch) {
			await ctx.watch();
			console.info("Watching for changes...");
		} else {
			await ctx.rebuild();
			await ctx.dispose();
			console.info("Build completed");
		}
	} catch (error) {
		console.error("Build failed", { error: error.toString() });
		process.exit(1);
	}
}

main().catch((e) => {
	console.error("Unexpected error", { error: e.toString() });
	process.exit(1);
});
