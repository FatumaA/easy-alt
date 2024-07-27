import * as vscode from "vscode";
import * as path from "path";
import { processDocument, handleDocumentChange } from "./documentProcessor";

const envPath = path.resolve(__dirname, "../.env");
require("dotenv").config({ path: envPath });

let statusBarItem: vscode.StatusBarItem;

export function activate(context: vscode.ExtensionContext) {
	console.log("Extension activated");
	vscode.window.showInformationMessage("Easy Alt Extension Activated");

	statusBarItem = vscode.window.createStatusBarItem(
		vscode.StatusBarAlignment.Right,
		100
	);
	context.subscriptions.push(statusBarItem);

	context.subscriptions.push(
		vscode.workspace.onDidChangeTextDocument(handleDocumentChange),
		vscode.workspace.onDidOpenTextDocument((document) =>
			processDocument(document, statusBarItem)
		)
	);

	vscode.window.visibleTextEditors.forEach((editor) =>
		processDocument(editor.document, statusBarItem)
	);
}

export function deactivate() {}
