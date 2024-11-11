import * as vscode from "vscode";
import * as fs from "fs/promises";
import * as path from "path";
import * as dotenv from "dotenv";
import { provider } from "./altTextGen";
dotenv.config({ path: path.join(__dirname, "../.env") });

export async function activate(context: vscode.ExtensionContext) {
	vscode.window.showInformationMessage("Easy Alt Extension Activated");

	let disposable = vscode.commands.registerCommand(
		"easy-alt.generateAlt",
		() => {
			const editor = vscode.window.activeTextEditor;
			if (!editor) {
				return;
			}
			vscode.commands.executeCommand("editor.action.triggerSuggest");
		}
	);

	context.subscriptions.push(provider, disposable);
}

export function deactivate() {}
