import * as vscode from "vscode";
import { processDocument, handleDocumentChange } from "./documentProcessor";

export function activate(context: vscode.ExtensionContext) {
	console.log("Extension activated");
	vscode.window.showInformationMessage("Easy Alt Extension Activated");

	context.subscriptions.push(
		vscode.workspace.onDidChangeTextDocument(handleDocumentChange),
		vscode.workspace.onDidOpenTextDocument(processDocument)
	);

	vscode.window.visibleTextEditors.forEach((editor) =>
		processDocument(editor.document)
	);
}

export function deactivate() {}
