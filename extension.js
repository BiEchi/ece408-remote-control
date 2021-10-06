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

	// This part of code will only be executed once when your extension is activated
	const account = "haob2";
	const passwd = "thanbell16";
	const num_lab = 0;

	// this function is already finished
	let disposable1 = vscode.commands.registerCommand('ece408-remote-control.login', function () {
		
		// Initialization
		var webdriver = require('selenium-webdriver'),
		By = webdriver.By,
		until = webdriver.until;

		try {
			var driver = new webdriver.Builder()
				.forBrowser('safari')
				.build();
		} catch (e) {
			console.log(e);
		}

		// Certify the website
		driver.get('https://www.webgpu.net');

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

	// this function is still troublesome
	let disposable2 = vscode.commands.registerCommand('ece408-remote-control.pull', function () {

		// get the raw data
		var code_promise = driver.wait(until.elementLocated(By.xpath('//*[@id="code"]/div[1]/div[2]/div/span/div/div[6]/div[1]/div/div/div'), 20));
		var code = code_promise.getText();

		// examine the code
		code.then((code) => {
			 vscode.window.showInformationMessage("You've now get " + code);
		})

		// process the raw data
		var reg = /[0-9]+/g;
		var clean_code = code.replace(reg, "\n");

		// save the raw data and overwrite the lab project
		// var fs = require('fs');
		// fs.writeFileSync("./lab2.cu", "fuck you!");

		vscode.window.showInformationMessage("You've now successfully pulled the code of lab " + num_lab.toString() + ".");
	});

	// this is the core functionality of this project
	let disposable3 = vscode.commands.registerCommand('ece408-remote-control.push', function () {
		const fs = require('fs');
		fs.readFile('./lab2.cu', 'utf8' , (err, data) => {
			// if (err) {
			// 	console.error(err);
			// 	return;
			// }
			vscode.window.showInformationMessage("You've now get" + data);
		})

		vscode.window.showInformationMessage("You've now successfully pushed the code to lab " + num_lab.toString() + 
		", and the feedback is stored in './output.txt' now. Check it!");
	});

	let disposable4 = vscode.commands.registerCommand('ece408-remote-control.exit', function () {
		driver.quit();
		vscode.window.showInformationMessage("You've successfully exit your account!");
	});

	for (let item in {disposable1, disposable2, disposable3, disposable4})
		context.subscriptions.push(item);
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
