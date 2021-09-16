// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const { SSL_OP_EPHEMERAL_RSA } = require('constants');
const { Keyboard } = require('selenium-webdriver/lib/input');
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

	// Temporary store the data in the variables here. Later need to be transfered to command line input.
	const account = "haob2";
	const passwd = "thanbell16";
	const num_lab = 0;

	// Initialization
	var webdriver = require('selenium-webdriver'),
		By = webdriver.By,
		until = webdriver.until;

	var driver = new webdriver.Builder()
		.forBrowser('chrome')
		.build();

	driver.get('https://www.webgpu.net');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('ece408-remote-control.login', function () {
		// The code you place here will be executed every time your command is executed

		// Login process
		var login_button = driver.wait(until.elementLocated(By.xpath('//*[@id="content"]/div/div/div/div[3]/a[2]/div'), 20));
		login_button.click();

		var account_box = driver.wait(until.elementLocated(By.xpath('//*[@id="user_name"]'), 20));
		account_box.sendKeys(account);
		var passwd_box = driver.wait(until.elementLocated(By.xpath('//*[@id="password"]'), 20));
		passwd_box.sendKeys(passwd);

		var confirm_login_button = driver.wait(until.elementLocated(By.xpath('/html/body/div/div/div/form/div[3]/div/button'), 20));
		confirm_login_button.click();

		// Go to the number of lab you want to go
		var dropdown_toggle = driver.wait(until.elementLocated(By.xpath('/html/body/nav/div/nav/ul[1]/li[1]/a'), 20));
		dropdown_toggle.click();

		var xpath_num = num_lab + 4;
		var xpath_lab_button = '/html/body/nav/div/nav/ul[1]/li[1]/ul/li[' + xpath_num.toString() + ']/a';
		var lab_button = driver.wait(until.elementLocated(By.xpath(xpath_lab_button), 20));
		lab_button.click();

		var code_tab = driver.wait(until.elementLocated(By.xpath('//*[@id="code-tab"]'), 20));
		code_tab.click();

		vscode.window.showInformationMessage("Successfully logged in to your WebGPU account and accessing Lab" + num_lab.toString() + ".");
	});

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable2 = vscode.commands.registerCommand('ece408-remote-control.pull', function () {
		// Obtain the raw data
		// var webgpu_codebox = driver.wait(until.elementLocated(By.xpath('//*[@id="code"]/div[1]/div[2]/div/span/div/div[6]/div[1]/div/div/div/div[5]'), 20));
		// var raw_content = webgpu_codebox.getText();
		// vscode.window.showInformationMessage(raw_content);

		// process the raw data
		var clean_content = "Hey!";

		// save the raw data and overwrite the lab project
		var fs = require('fs');
		fs.writeFileSync("./lab2.cu", "fuck you!");

		vscode.window.showInformationMessage("You've now successfully pulled the code of lab " + num_lab.toString() + ".");
	});

	context.subscriptions.push(disposable);
	context.subscriptions.push(disposable2);
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
