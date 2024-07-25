import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";

let HfInference;
import("@huggingface/inference").then((module) => {
	HfInference = module.HfInference;
});

const HF_TOKEN = "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"; // Replace with your actual token
const MODEL = "nlpconnect/vit-gpt2-image-captioning";

const processedLines = new Set<string>();

export function activate(context: vscode.ExtensionContext) {
	console.log("Extension activated");

	context.subscriptions.push(
		vscode.workspace.onDidChangeTextDocument(handleDocumentChange)
	);

	// Handle any already open text editors
	vscode.window.visibleTextEditors.forEach((editor) =>
		processDocument(editor.document)
	);
}

const debouncedHandleDocumentChange = debounce(
	(event: vscode.TextDocumentChangeEvent) => {
		processDocument(event.document);
	},
	300
);

function handleDocumentChange(event: vscode.TextDocumentChangeEvent) {
	if (["html", "jsx", "tsx"].includes(event.document.languageId)) {
		debouncedHandleDocumentChange(event);
	}
}

async function processDocument(document: vscode.TextDocument) {
	for (let i = 0; i < document.lineCount; i++) {
		const line = document.lineAt(i);
		const lineKey = `${document.uri.toString()}:${i}`;
		if (!processedLines.has(lineKey)) {
			const imgTag = findImgTagWithoutAlt(line.text);
			if (imgTag) {
				await generateAndInsertAltText(document, i, imgTag);
				processedLines.add(lineKey);
			}
		}
	}
}

function findImgTagWithoutAlt(text: string): string | null {
	const imgRegex = /<img[^>]+src\s*=\s*['"]([^'"]+)['"][^>]*>/;
	const match = text.match(imgRegex);
	if (
		match &&
		(!match[0].includes("alt=") ||
			match[0].includes('alt=""') ||
			match[0].includes("alt=''"))
	) {
		return match[0];
	}
	return null;
}

async function generateAndInsertAltText(
	document: vscode.TextDocument,
	line: number,
	imgTag: string
) {
	const srcRegex = /src\s*=\s*["']([^"']+)["']/;
	const srcMatch = imgTag.match(srcRegex);
	if (srcMatch) {
		const imgSrc = srcMatch[1];
		let altText;

		if (imgSrc.startsWith("http://") || imgSrc.startsWith("https://")) {
			altText = await generateAltTextForRemoteImage(imgSrc);
		} else {
			altText = await generateAltTextForLocalImage(document, imgSrc);
		}

		if (altText) {
			await insertAltText(document, line, imgTag, altText);
		}
	}
}

async function generateAltTextForRemoteImage(
	imgSrc: string
): Promise<string | null> {
	try {
		console.log("Generating alt text for remote image:", imgSrc);

		const res = await fetch(imgSrc);
		const blob = await res.blob();

		const hf = new HfInference(HF_TOKEN);
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

		const imagePath = path.join(workspaceFolder.uri.fsPath, imgSrc);

		// Check if the file exists
		if (!fs.existsSync(imagePath)) {
			console.error(`Image file not found: ${imagePath}`);
		}

		const imageBuffer = await fs.promises.readFile(imagePath);

		const hf = new HfInference(HF_TOKEN);
		const imgDesc = await hf.imageToText({
			data: imageBuffer,
			model: MODEL,
		});

		console.log("Generated alt text:", imgDesc.generated_text);
		return imgDesc.generated_text;
	} catch (error) {
		console.error("Error generating alt text for local image:", error);
		vscode.window.showErrorMessage(
			`Failed to generate alt text for local image: ${error}`
		);
		return null;
	}
}

async function insertAltText(
	document: vscode.TextDocument,
	line: number,
	imgTag: string,
	altText: string
) {
	const editor = await vscode.window.showTextDocument(document);

	let newImgTag: string;
	if (imgTag.includes("alt=")) {
		// Update existing alt attribute
		newImgTag = imgTag.replace(/alt=["'][^"']*["']/, `alt="${altText}"`);
	} else {
		// Insert new alt attribute
		newImgTag = imgTag.replace(">", ` alt="${altText}">`);
	}

	await editor.edit((editBuilder) => {
		const range = new vscode.Range(
			new vscode.Position(line, document.lineAt(line).text.indexOf(imgTag)),
			new vscode.Position(
				line,
				document.lineAt(line).text.indexOf(imgTag) + imgTag.length
			)
		);
		editBuilder.replace(range, newImgTag);
	});

	vscode.window.showInformationMessage(`Alt text added: ${altText}`);
}

function debounce(func: Function, wait: number) {
	let timeout: NodeJS.Timeout | null = null;
	return function (...args: any[]) {
		const context = this;
		if (timeout) clearTimeout(timeout);
		timeout = setTimeout(() => func.apply(context, args), wait);
	};
}

export function deactivate() {}
