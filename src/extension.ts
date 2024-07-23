import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "easy-alt" is now active!');

	const disposable = vscode.commands.registerCommand("easy-alt.hello", () => {
		vscode.window.showInformationMessage("Hello World from easy alt!!!");
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
