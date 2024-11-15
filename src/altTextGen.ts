import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs/promises";
import { downloadImage, initModel } from "./utils";

export const provider = vscode.languages.registerCompletionItemProvider(
	["html", "jsx", "tsx"],
	{
		async provideCompletionItems(
			document: vscode.TextDocument,
			position: vscode.Position
		) {
			const lineText = document.lineAt(position).text;
			const linePrefix = lineText.substring(0, position.character);

			if (!linePrefix.includes('alt="') && !linePrefix.includes("alt='")) {
				return undefined;
			}

			const imgRegex = /<img[^>]*src=["']([^"']+)["'][^>]*>/;
			const imgMatch = lineText.match(imgRegex);

			if (imgMatch) {
				const src = imgMatch[1];
				let imageBuffer: Buffer;

				try {
					let imagePath;
					if (isRemoteUrl(src)) {
						imageBuffer = await downloadImage(src);
					} else {
						const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
						if (!workspaceFolder) {
							throw new Error("No workspace folder found.");
						}
						const cleanSrc = src.replace(/^[./]+/, "");
						imagePath = path.resolve(workspaceFolder.uri.fsPath, cleanSrc);
						imageBuffer = await fs.readFile(imagePath);
					}

					const caption = await generateCaption(imageBuffer);

					const completion = new vscode.CompletionItem(
						caption,
						vscode.CompletionItemKind.Value
					);
					completion.insertText = caption;
					completion.detail = "AI Generated Alt Text";

					const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
					const imageUrl = isRemoteUrl(src)
						? src
						: vscode.Uri.file(imagePath!).toString();

					completion.documentation = new vscode.MarkdownString(
						`<img src="${imageUrl}" width="200" style="max-width: 100%; height: auto;">\n\nPreview: ${caption}\n\n*Generated by Easy Alt*`
					);
					completion.documentation.baseUri = workspaceFolder
						? vscode.Uri.file(workspaceFolder.uri.fsPath)
						: undefined;
					completion.documentation.supportHtml = true;
					completion.documentation.isTrusted = true;

					return [completion];
				} catch (error) {
					// Create error completion item
					const errorCompletion = new vscode.CompletionItem(
						`Error: ${error}`,
						vscode.CompletionItemKind.Text
					);
					errorCompletion.detail = "Easy Alt Error";

					errorCompletion.documentation = new vscode.MarkdownString(
						"An error occurred, please try again or leave an issue on GitHub: https://github.com/FatumaA/easy-alt/issues"
					);

					vscode.window.showErrorMessage(`Error processing image: ${error}`);
					return [errorCompletion];

					// return undefined;
				}
			}

			return undefined;
		},
	},
	'"',
	"'"
);

function isRemoteUrl(url: string): boolean {
	return url.startsWith("http://") || url.startsWith("https://");
}

async function generateCaption(imageBuffer: Buffer): Promise<string> {
	const captioner = await initModel();
	if (!captioner) {
		throw new Error("Image captioning model not initialized.");
	}

	try {
		if (!(imageBuffer instanceof Buffer)) {
			throw new Error("Invalid image data: not a Buffer");
		}

		const result = await captioner.imageToText({
			data: imageBuffer,
			model: "Salesforce/blip-image-captioning-large",
		});

		console.log("RES", result);

		if (!result) {
			throw new Error("Unexpected response from image captioning model");
		}

		return result.generated_text;
	} catch (error) {
		console.error("Error in generateCaption:", error);
		throw error;
	}
}
