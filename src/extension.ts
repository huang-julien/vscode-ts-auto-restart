// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

let interval: NodeJS.Timeout | null = null;
const output = vscode.window.createOutputChannel('restart-ts-server')

export function activate(context: vscode.ExtensionContext) {

	const typescript = vscode.extensions.getExtension('vscode.typescript-language-features')


	let start = vscode.commands.registerCommand('ts-auto-restart.start', () => {
		vscode.window.showInputBox({
			title: 'What interval do you want to restart TS Server ? (default 30sec)',
			validateInput(value) {
				return isNaN(Number(value)) ? 'Please input an Int' : null;
			}
		}).then((value) => {
			const seconds = parseInt(value || '30', 10);

			if (interval) {
				clearInterval(interval);
				interval = null;
			}

			vscode.window.showInformationMessage(`Restart TS Server every ${seconds} seconds !`)
			interval = setInterval(() => {
				if (typescript && typescript.isActive) {
					vscode.commands.executeCommand('typescript.restartTsServer')
					output.appendLine(`[${new Date().toLocaleString()}] Restarting TS Server !`)
				}
			}, seconds * 1000);
		})
	});

	let end = vscode.commands.registerCommand('ts-auto-restart-30sec.stop', () => {
		if (interval) {
			clearInterval(interval);
			interval = null;
			output.appendLine(`[${new Date().toLocaleString()}] Stop restart interval !`)
		}
	})

	context.subscriptions.push(start, end);
}

// This method is called when your extension is deactivated
export function deactivate() {
	if (interval) {
		clearInterval(interval);
	}
	output.dispose();
}
