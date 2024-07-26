import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import { HTMLElement } from "node-html-parser";
const hfIn = require("@huggingface/inference");

const HF_TOKEN = process.env.HF_TOKEN;
const MODEL = "nlpconnect/vit-gpt2-image-captioning";
const hf = new hfIn.HfInference(HF_TOKEN);

export async function generateAndInsertAltText(
	document: vscode.TextDocument,
	imgTag: HTMLElement
): Promise<string | null> {
	const imgSrc = imgTag.getAttribute("src");
	if (!imgSrc) {
		console.error("No src attribute found in the img tag");
		vscode.window.showErrorMessage(
			"Failed to find src attribute in the img tag"
		);
		return null;
	}

	console.log(`Generating alt text for image: ${imgSrc}`);

	try {
		let altText;
		if (imgSrc.startsWith("http://") || imgSrc.startsWith("https://")) {
			altText = await generateAltTextForRemoteImage(imgSrc);
		} else {
			altText = await generateAltTextForLocalImage(document, imgSrc);
		}

		if (altText) {
			vscode.window.showInformationMessage(`Alt text generated: ${altText}`);
			return altText;
		} else {
			throw new Error("Failed to generate alt text: No text was generated");
		}
	} catch (error) {
		console.error("Error in generateAndInsertAltText:", error);
		vscode.window.showErrorMessage(`Failed to generate alt text: ${error}`);
		return null;
	}
}

async function generateAltTextForRemoteImage(
	imgSrc: string
): Promise<string | null> {
	try {
		console.log("Generating alt text for remote image:", imgSrc);

		const res = await fetch(imgSrc);
		const blob = await res.blob();

		const imgDesc = await hf.imageToText({
			data: blob,
			model: MODEL,
		});

		console.log("Generated alt text:", imgDesc.generated_text);
		return imgDesc.generated_text;
	} catch (error) {
		console.error("Error generating alt text for remote image:", error);
		vscode.window.showErrorMessage(
			`Failed to generate alt text for remote image: ${error}`
		);
		return null;
	}
}

async function generateAltTextForLocalImage(
	document: vscode.TextDocument,
	imgSrc: string
): Promise<string | null> {
	try {
		console.log("Generating alt text for local image:", imgSrc);

		const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri);
		if (!workspaceFolder) {
			throw new Error("No workspace folder found");
		}

		const documentDir = path.dirname(document.uri.fsPath);
		let imagePath = path.resolve(documentDir, imgSrc);
		console.log("Full image path:", imagePath);

		if (!fs.existsSync(imagePath)) {
			throw new Error(`Image file not found: ${imagePath}`);
		}

		if (fs.statSync(imagePath).isDirectory()) {
			const files = fs.readdirSync(imagePath);
			const imageFile = files.find((file) =>
				/\.(jpg|jpeg|png|gif)$/i.test(file)
			);
			if (imageFile) {
				imagePath = path.join(imagePath, imageFile);
				console.log("Found image in directory:", imagePath);
			} else {
				throw new Error(`No image files found in directory: ${imagePath}`);
			}
		}

		const imageBuffer = await fs.promises.readFile(imagePath);

		const imgDesc = await hf.imageToText({
			data: imageBuffer,
			model: MODEL,
		});

		if (!imgDesc || !imgDesc.generated_text) {
			throw new Error("No text generated from the image");
		}

		console.log("Generated alt text:", imgDesc.generated_text);
		return imgDesc.generated_text;
	} catch (error) {
		console.error("Error generating alt text for local image:", error);
		throw error;
	}
}