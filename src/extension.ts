import * as vscode from "vscode";
const logger = require("../logger");
import * as path from "path";
import { processDocument, handleDocumentChange } from "./documentProcessor";

const envPath = path.resolve(__dirname, "../.env");
require("dotenv").config({ path: envPath });

process.on("uncaughtException", (error) => {
	logger.error("Uncaught exception:", error);
});

process.on("unhandledRejection", (reason, promise) => {
	logger.error("Unhandled rejection:", reason);
});

let statusBarItem: vscode.StatusBarItem;

export function activate(context: vscode.ExtensionContext) {
	logger.info("Extension activated");
	try {
		vscode.window.showInformationMessage("Easy Alt Extension Activated");

		const statusBarItem = vscode.window.createStatusBarItem(
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
	} catch (error) {
		logger.error("An error occurred:", error);

		throw error;
	}
}

export function deactivate() {}
