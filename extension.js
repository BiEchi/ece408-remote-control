// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "ece408-remote-control" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('ece408-remote-control.push', function () {
		// The code you place here will be executed every time your command is executed

		// Main code area, use selenium for automation
		var webdriver = require('selenium-webdriver'),
			By = webdriver.By,
			until = webdriver.until;

		var driver = new webdriver.Builder()
			.forBrowser('chrome')
			.build();

		driver.get('https://www.baidu.com');
		driver.findElement(By.id('kw')).sendKeys('webdriver');
		driver.findElement(By.id('su')).click();
		driver.wait(until.titleIs('webdriver_百度搜索'), 1000);
		driver.quit();

		// Display a message box to the user
		vscode.window.showInformationMessage("You've now successfully pushed your code to WebGPU!");
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
