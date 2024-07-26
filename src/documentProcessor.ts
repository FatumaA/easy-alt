import * as vscode from "vscode";
import { parse } from "node-html-parser";
import { debounce } from "./utils";
import { generateAndInsertAltText } from "./altTextGenerator";

export const handleDocumentChange = debounce(
	(event: vscode.TextDocumentChangeEvent) => {
		if (["html", "jsx", "tsx"].includes(event.document.languageId)) {
			processDocument(event.document);
		}
	},
	300
);

export async function processDocument(document: vscode.TextDocument) {
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

			if (!imgTag.getAttribute("alt")) {
				const altText = await generateAndInsertAltText(document, imgTag);
				if (altText) {
					imgTag.setAttribute("alt", altText);
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
	}
}
