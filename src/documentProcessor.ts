import * as vscode from "vscode";
import { parse, HTMLElement } from "node-html-parser";
import { generateAndInsertAltText } from "./altTextGenerator";

let typingTimeout: NodeJS.Timeout | null = null;
const processedImages = new Set<string>();

export function handleDocumentChange(event: vscode.TextDocumentChangeEvent) {
	if (["html", "jsx", "tsx"].includes(event.document.languageId)) {
		if (typingTimeout) {
			clearTimeout(typingTimeout);
		}
		typingTimeout = setTimeout(() => {
			processDocument(
				event.document,
				vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100)
			);
		}, 2000); // Wait 2 seconds after the last change
	}
}

export async function processDocument(
	document: vscode.TextDocument,
	statusBarItem: vscode.StatusBarItem
) {
	statusBarItem.text = "$(sync~spin) Generating alt text...";
	statusBarItem.show();

	try {
		let text = document.getText();
		const root = parse(text, { parseNoneClosedTags: true });
		const imgTags = root.querySelectorAll("img");
		console.log(`Found ${imgTags.length} img tags`);

		let hasChanges = false;

		for (const imgTag of imgTags) {
			if (imgTag.hasAttribute("body")) {
				imgTag.removeAttribute("body");
				hasChanges = true;
			}

			const imgSrc = imgTag.getAttribute("src");
			if (
				imgSrc &&
				!processedImages.has(imgSrc) &&
				!imgTag.getAttribute("alt")
			) {
				const altText = await generateAndInsertAltText(document, imgTag);
				if (altText) {
					imgTag.setAttribute("alt", altText);
					processedImages.add(imgSrc);
					hasChanges = true;
				}
			}
		}

		if (hasChanges) {
			const edit = new vscode.WorkspaceEdit();
			edit.replace(
				document.uri,
				new vscode.Range(0, 0, document.lineCount, 0),
				root.toString()
			);
			const editResult = await vscode.workspace.applyEdit(edit);
			console.log(`Edit applied: ${editResult}`);
		}
	} catch (error) {
		console.error("Error in processDocument:", error);
		vscode.window.showErrorMessage(`Error processing document: ${error}`);
	} finally {
		statusBarItem.hide();
	}
}
