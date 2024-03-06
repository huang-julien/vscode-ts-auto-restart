// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

let interval: NodeJS.Timeout | null = null;
const output = vscode.window.createOutputChannel('restart-ts-server')

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	const typescript = vscode.extensions.getExtension('vscode.typescript-language-features')


	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let start = vscode.commands.registerCommand('ts-auto-restart-30sec.start', () => {
		vscode.window.showInformationMessage('Restarting ts every 30 sec !');
		if (interval) {
			clearInterval(interval);
			interval = null;
		}
		interval = setInterval(() => {
			if (typescript && typescript.isActive) {
				vscode.commands.executeCommand('typescript.restartTsServer')
				output.appendLine(`[${new Date().toLocaleString()}] Restarting TS Server !`)
			}
		}, 30000);

	});

	 vscode.commands.registerCommand('ts-auto-restart-30sec.stop', () => {
		if (interval) {
			clearInterval(interval);
			interval = null;
			output.appendLine(`[${new Date().toLocaleString()}] Stop restart interval !`)

		}
	})

	context.subscriptions.push(start);
}

// This method is called when your extension is deactivated
export function deactivate() {
	if (interval) {
		clearInterval(interval);
	}
	output.dispose();
}
