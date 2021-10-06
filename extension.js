// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const { SSL_OP_EPHEMERAL_RSA } = require('constants');
const { Keyboard } = require('selenium-webdriver/lib/input');
const { getCombinedModifierFlags } = require('typescript');
const vscode = require('vscode');


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	function bad_ssl(driver) {
		// website error handling (temporary)
		var advanced_button = driver.wait(until.elementLocated(By.xpath('//*[@id="details-button"]'), 20));
		advanced_button.click();
	
		var proceed_button = driver.wait(until.elementLocated(By.xpath('//*[@id="proceed-link"]'), 20));
		proceed_button.click();
	}

	function login(driver) {
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
	}

	function get_code(driver){
		// get the code
		var code_editor = driver.wait(until.elementLocated(By.xpath('//*[@id="code"]/div[1]/div[2]/div/span/textarea'), 20));
		var code = code_editor.getText();

		// examine the code
		code.then((code) => {
				vscode.window.showInformationMessage("You've now got " + code);
		})

		return code;
	}

	function save_file(code){
		const fs = require('fs');
		const currentlyOpenTabfilePath = vscode.window.activeTextEditor.document.fileName;
		fs.truncateSync(currentlyOpenTabfilePath);
		fs.appendFileSync(currentlyOpenTabfilePath, code);
	}

	// This part of code will only be executed once when your extension is activated
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

	// this function is already finished
	let disposable1 = vscode.commands.registerCommand('ece408-remote-control.login', function () {
		// Certify the website
		driver.get('https://www.webgpu.net');
		// handle the bad SSL certification condition
		bad_ssl(driver);
		// Login process
		login(driver);
		// feedback
		vscode.window.showInformationMessage("Successfully logged in to your WebGPU account and accessing Lab" + num_lab.toString() + ".");
	});

	// this function is still troublesome
	let disposable2 = vscode.commands.registerCommand('ece408-remote-control.pull', function () {
		// get the code from the lab page
		var code = get_code(driver);
		// save the raw data and overwrite the lab project
		save_file(code);
		// feedback
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
