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

	function click_run(driver){
		// click on the "compile & run button" button
		var compile_button = driver.wait(until.elementLocated(By.xpath('//*[@id="code"]/div[1]/div[1]/div/div[2]/div[1]/div'), 20));
		compile_button.click();
		// click on the "all" dataset button
		var all_button = driver.wait(until.elementLocated(By.xpath('/html/body/div[1]/div/div/div[2]/div[1]/div[1]/div/div[2]/div[1]/ul/li[8]/a'), 20));
		all_button.click();
	}

	function push_code(driver, code){
		// drag the code from the local file and push it to the webgpu website
		// var input_box = driver.wait(until.elementLocated(By.xpath('//*[@id="code"]/div[1]/div[2]/div/span/textarea'), 20));
		var input_box = driver.wait(until.elementLocated(By.xpath('//*[@id="code"]'), 20));
		input_box.sendKeys(code);
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

	// This part of code will only be executed once when your extension is activated
	var account = "haob2"; 
	var passwd = "thanbell16";
	var num_lab = 1; // interger

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
	
	// Initialization
	var webdriver = require('selenium-webdriver'),
		By = webdriver.By,
		until = webdriver.until;

	var driver = new webdriver.Builder()
		.forBrowser('chrome')
		.build();

	let login_process = vscode.commands.registerCommand('ece408-remote-control.login', function () {
		// Certify the website
		driver.get('https://www.webgpu.net');
		// handle the bad SSL certification condition
		bad_ssl(driver);
		// Login process
		login(driver);
		// feedback
		vscode.window.showInformationMessage("Successfully logged in to your WebGPU account and accessing Lab" + num_lab.toString() + ".");
	});

	let pull_process = vscode.commands.registerCommand('ece408-remote-control.pull', function () {
		// get the code
		var program_url;
		if (num_lab == 0) {
			program_url = 'https://www.webgpu.net/mp/9999/program';
		} else {
			program_url = 'https://www.webgpu.net/' + (num_lab+10000).toString() + '/prorgam';
		}
		driver.get(program_url);
		var code_editor = driver.wait(until.elementLocated(By.xpath('/html/body/pre'), 20));
		var code = code_editor.getText();
		code.then((code) => {
			// save the raw data and overwrite the lab project
			save_file(code);
		})
		// return to the editing page
		driver.get('https://www.webgpu.net');
		// go through the login subroutine again
		login(driver);
	});

	let push_process = vscode.commands.registerCommand('ece408-remote-control.push', function () {
		// read the file into the buffer
		var code = read_file();
		// transfer the buffer onto the webpage
		push_code(driver, code);
		// click on the "submit & run button" and "all" datasets
		click_run(driver);
		// pull down the whole HTML source code and save in an HTML file
		download_html(driver);
		// render the HTML source code locally
		render_html();
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
