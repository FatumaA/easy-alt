import * as vscode from "vscode";
import * as path from "path";
import * as dotenv from "dotenv";
dotenv.config({ path: path.join(__dirname, "../.env") });

export const initModel = async () => {
	let captioner: any;
	const HfInference = (await import("@huggingface/inference")).HfInference;

	const hfToken =
		vscode.workspace.getConfiguration("easyAlt").get("hfToken") ||
		process.env.HF_TOKEN;

	if (!hfToken) {
		vscode.window.showErrorMessage(
			"HF_TOKEN environment variable is not set. Please set it to use Easy Alt."
		);
		return;
	}
	captioner = new HfInference(hfToken as string);

	return captioner;
};
export const downloadImage = async (url: string): Promise<Buffer> => {
	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(
				`Failed to download image: ${response.status} ${response.statusText}`
			);
		}
		const arrayBuffer = await response.arrayBuffer();
		return Buffer.from(arrayBuffer);
	} catch (error) {
		console.error("Error in downloadImage:", error);
		throw error;
	}
};
