// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
// Please do NOT add anything not related below
const vscode = require('vscode');

// this method is called when sion is activated
// your extension is activated the very first time the command is executed
/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

		// This part of code will only be executed once when your extension is activated
		var account = "haob2"; 
		var passwd = "thanbell16";
		var num_lab = 1; // interger

		// Initialization
		const {Builder, By, Key, until} = require('selenium-webdriver');
		var webdriver = require('selenium-webdriver');
	
		var driver = new webdriver.Builder()
			.forBrowser('chrome')
			.build();
		// switch to full screen
		driver.manage().window().maximize(); 

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

		// optional, only for narrow size pattern
		var dropdown_toggle = driver.wait(until.elementLocated(By.xpath('/html/body/nav/div/div/button'), 20));
		dropdown_toggle.click();

		// Go to the number of lab you want
		var lab_toggle = driver.wait(until.elementLocated(By.xpath('/html/body/nav/div/nav/ul[1]/li[1]/a'), 20));
		lab_toggle.click();

		var xpath_num = num_lab + 4;
		var xpath_lab_button = '/html/body/nav/div/nav/ul[1]/li[1]/ul/li[' + xpath_num.toString() + ']/a';
		var lab_button = driver.wait(until.elementLocated(By.xpath(xpath_lab_button), 20));
		lab_button.click();

		var code_tab = driver.wait(until.elementLocated(By.xpath('//*[@id="code-tab"]'), 20));
		code_tab.click();
	}

	function save_file(code){
		const fs = require('fs');
		const currentlyOpenTabfilePath = vscode.window.activeTextEditor.document.fileName;
		fs.truncateSync(currentlyOpenTabfilePath);
		fs.appendFileSync(currentlyOpenTabfilePath, code);
	}

	function read_file(){
		const currentlyOpenTabfilePath = vscode.window.activeTextEditor.document.fileName;
		const fs = require('fs');
		const code = fs.readFileSync(currentlyOpenTabfilePath, 'utf8');
		return code;
	}

	function push_code(code){
		// call the python script to paste the content
		const spawn = require("child_process").spawn;

		// copy the variable onto the clipboard
		const python_copy = spawn('python',["./copy.py", code]);
		python_copy.stdout.on('data', (data) => {
			if (data == 'success') vscode.window.showInformationMessage("Python copy returns value " + data);
			else vscode.window.showInformationMessage("Python copy returns value " + 'fail');
		});

		// Move the cursor to the element and click 
		var code_line = driver.wait(until.elementLocated(By.xpath('//*[@id="code"]/div[1]/div[2]/div/span/div/div[6]/div[1]/div/div/div/div[5]/div[1]/pre/span/span'), 20));
		code_line.click();

		// last test
		const actions = driver.actions();
		actions
		.click(code_line)
		.keyDown(Key.COMMAND)
		.sendKeys('a')
		.sendKeys('v')
		.keyUp(Key.COMMAND)
		.perform();
	}

	function click_run(driver){
		// click on the "compile & run button" button
		var compile_button = driver.wait(until.elementLocated(By.xpath('//*[@id="code"]/div[1]/div[1]/div/div[2]/div[1]/div'), 20));
		compile_button.click();
		// click on the "all" dataset button
		var all_button = driver.wait(until.elementLocated(By.xpath('/html/body/div[1]/div/div/div[2]/div[1]/div[1]/div/div[2]/div[1]/ul/li[8]/a'), 20));
		all_button.click();
	}

	function download_html(driver){
		// driver.get("https://baidu.com"); // test code
		driver.getCurrentUrl() // nonsense, only for syntax
			.then(function() {
				return driver.getCurrentUrl();
			})
			.then(function(currentUrl) {
				// work with the current url of browser
				const rp = require('request-promise');
				var html_source = rp(currentUrl);
				html_source.then(function(html_source){
					// save the file to ./feedback.html
					const fs = require('fs');
					const currentlyOpenTabfilePath = vscode.window.activeTextEditor.document.fileName;
					const index = currentlyOpenTabfilePath.lastIndexOf("\/");  
					const currentlyOpenTabdirPath = currentlyOpenTabfilePath.substring(0, index+1) + "/feedback.html"
					fs.truncateSync(currentlyOpenTabdirPath);
					fs.appendFileSync(currentlyOpenTabdirPath, html_source);
				});
			});
	}

	function render_html(){
		// only for testing
		vscode.window.showInformationMessage("Please use the Live Share extension to render the HTML code!");
	}


	let config_process = vscode.commands.registerCommand('ece408-remote-control.config', function () {
		vscode.window.showInputBox(
			{
				password:false,
				ignoreFocusOut:true, // when the cursor focuses on other places, the input box is still there
				placeHolder:'Please input your account, password and your intended lab number: ', // notification
				prompt:'Use the format like "lyon2 mypasswd 2"',
			}).then(function(information){
				var information_array = information.split(" ");
				account = information_array[0]; 
				passwd = information_array[1];
				num_lab = parseInt(information_array[2]); // convert to integer
		});
	});
	

	let login_process = vscode.commands.registerCommand('ece408-remote-control.login', function () {
		// Certify the website
		driver.get('https://www.webgpu.net');
		bad_ssl(driver);
		login(driver);
		vscode.window.showInformationMessage("Successfully logged in to your WebGPU account and accessing Lab" + num_lab.toString() + ".");
	});

	let pull_process = vscode.commands.registerCommand('ece408-remote-control.pull', function () {
		// get the code
		driver.getCurrentUrl() // nonsense, only for syntax
		.then(function() {
			return driver.getCurrentUrl();
		})
		.then(function(currentUrl) {
			// work with the current url of browser
			var code_editor = driver.wait(until.elementLocated(By.xpath('/html/body/pre'), 20));
			driver.get(currentUrl + "/program/");
			return code_editor;
		})
		.then(function(code_editor){
			var code = code_editor.getText();
			code.then((code) => {
				// save the raw data and overwrite the lab project
				save_file(code);
				// return to the editing page
				driver.get('https://www.webgpu.net');
				// go through the login subroutine again
				login(driver);
			})
		})
	});

	let push_process = vscode.commands.registerCommand('ece408-remote-control.push', function () {
		// read the file into the buffer
		var code = read_file();
		// TODO: transfer the buffer onto the webpage
		push_code(code);
		// click on the "submit & run button" and "all" datasets
		click_run(driver);
		// pull down the whole HTML source code and save in an HTML file
		// download_html(driver);
		// render the HTML source code locally
		// render_html();
	});

	let exit_process = vscode.commands.registerCommand('ece408-remote-control.exit', function () {
		driver.quit();
		vscode.window.showInformationMessage("You've successfully exit your account!");
	});

	for (let item in {config_process, login_process, pull_process, push_process, exit_process})
		context.subscriptions.push(item);
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
