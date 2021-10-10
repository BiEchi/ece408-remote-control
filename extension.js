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

	// ********** GLOBAL-PARAMETERS ********** //

	// This part of code will only be executed once when your extension is activated
	var account; 
	var passwd;
	var num_lab = 999; // 999 for default
	var machine = 'mac'; // 'mac' for default

	// lookup table for the num_lab-to-addr map
	var addr_list = ['9999', '10001', '10002', '10003', '10010', '10004', '10005', '10011', '10124'];
	var addr;
	var first_time_login = true;

	// Initialization
	const {By, Key, until} = require('selenium-webdriver');
	var webdriver = require('selenium-webdriver');
	var driver = new webdriver.Builder()
		.forBrowser('chrome')
		.build();

	// switch to full screen (only once)
	// driver.manage().window().maximize(); 

	// ********** HELPER-FUNCTIONS ********** //

	function bad_ssl(driver) {
		// website error handling (temporary)
		var advanced_button = driver.wait(until.elementLocated(By.xpath('//*[@id="details-button"]'), 20));
		advanced_button.click();
	
		var proceed_button = driver.wait(until.elementLocated(By.xpath('//*[@id="proceed-link"]'), 20));
		proceed_button.click();
	}

	function login(driver) {
		if (first_time_login == true)
		{
			var login_button = driver.wait(until.elementLocated(By.xpath('//*[@id="content"]/div/div/div/div[3]/a[2]/div'), 20));
			login_button.click();
	
			var account_box = driver.wait(until.elementLocated(By.xpath('//*[@id="user_name"]'), 20));
			account_box.sendKeys(account);
			var passwd_box = driver.wait(until.elementLocated(By.xpath('//*[@id="password"]'), 20));
			passwd_box.sendKeys(passwd);
	
			var confirm_login_button = driver.wait(until.elementLocated(By.xpath('/html/body/div/div/div/form/div[3]/div/button'), 20));
			confirm_login_button.click()
			.then(function(){
				driver.get('https://www.webgpu.net/mp/' + addr);
				var code_tab = driver.wait(until.elementLocated(By.xpath('//*[@id="code-tab"]'), 20));
				code_tab.click();
			})
		} else {
			driver.wait(function() {
				return driver.findElement(By.xpath('//*[@id="content"]/div/div')).isDisplayed();
			}, 20)
			.then(function() {
				// Go to the number of lab you want
				driver.get('https://www.webgpu.net/mp/' + addr);
				var code_tab = driver.wait(until.elementLocated(By.xpath('//*[@id="code-tab"]'), 20));
				code_tab.click();
			})
		}
		first_time_login = false;
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

	function push_code_and_run(){
		// copy the code onto the clipboard of your machine
		vscode.window.showInformationMessage("Reminder: please save your code before you push!");
		var exec = require('child_process').exec;
		const currentlyOpenTabfilePath = vscode.window.activeTextEditor.document.fileName;
		if (machine == 'mac'){
			exec(`cat ${currentlyOpenTabfilePath} | pbcopy`);
		} else {
			exec(`cat ${currentlyOpenTabfilePath} | clip.exe`);
		}
		
		// Move the cursor to the first line of code and click 
		var code_line = driver.wait(until.elementLocated(By.xpath('//*[@id="code"]/div[1]/div[2]/div/span/div/div[6]/div[1]/div/div/div/div[5]/div[1]/pre/span/span'), 20));
		var compile_button = driver.wait(until.elementLocated(By.xpath('//*[@id="code"]/div[1]/div[1]/div/div[2]/div[1]/div'), 20));
		var all_button = driver.wait(until.elementLocated(By.xpath('/html/body/div[1]/div/div/div[2]/div[1]/div[1]/div/div[2]/div[1]/ul/li[8]/a'), 20));
		const actions = driver.actions();

		if (machine == 'mac'){
			actions
			.click(code_line)
			.keyDown(Key.COMMAND)
			.sendKeys('a')
			.sendKeys('v')
			.sendKeys('s')
			.keyUp(Key.COMMAND)
			// .sendKeys(code) // we use the approach to copy the code yourself instead
			.click(compile_button)
			.click(all_button)
			.perform();
		} else {
			actions
			.click(code_line)
			.keyDown(Key.CONTROL)
			.sendKeys('a')
			.sendKeys('v')
			.sendKeys('s')
			.keyUp(Key.CONTROL)
			// .sendKeys(code) // we use the approach to copy the code yourself instead
			.click(compile_button)
			.click(all_button)
			.perform();
		}

	}

	function download_html(driver){
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


	// ********** CALLER-FUNCTIONS ********** //

	let config_process = vscode.commands.registerCommand('ece408-remote-control.config', function () {
		vscode.window.showInputBox(
			{
				password:false,
				ignoreFocusOut:true, // when the cursor focuses on other places, the input box is still there
				placeHolder:'<account> <password> <intended lab number> <machine type>', // notification
				prompt:'Example: "lyon2 mypasswd 2 win". Note that for the machine type, only "win" or "mac" are allowed!',
			}).then(function(information){
				var information_array = information.split(" ");
				account = information_array[0]; 
				passwd = information_array[1];
				num_lab = parseInt(information_array[2]); // convert to integer
				addr = addr_list[num_lab];
				machine = information_array[3];
				vscode.window.showInformationMessage("Please verify: ACCOUNT=" + account + ", PASSWD=" + passwd + ", LAB NUMBER=" +num_lab.toString() + ", MACHINE TYPE=" +machine + ".");
		});
	});

	let login_process = vscode.commands.registerCommand('ece408-remote-control.login', function () {
		if (num_lab == 999) {
			vscode.window.showInformationMessage("Please input your account and password first!");
			return;
		}

		// Certify the website
		driver.get('https://www.webgpu.net/');
		bad_ssl(driver);
		login(driver);
		vscode.window.showInformationMessage("Successfully logged in to your WebGPU account and accessing Lab" + num_lab.toString() + ".");
	});

	let pull_process = vscode.commands.registerCommand('ece408-remote-control.pull', function () {
		// get the code
		var code_editor = driver.wait(until.elementLocated(By.xpath('/html/body/pre'), 20));
		driver.get('https://www.webgpu.net/mp/' + addr + '/program/')
		.then(function(){
			var code = code_editor.getText();
			code.then(function(code) {
				// save the raw data and overwrite the lab project
				save_file(code);
				// go through the login subroutine again
				driver.get('https://www.webgpu.net/mp/' + addr);
				var code_tab = driver.wait(until.elementLocated(By.xpath('//*[@id="code-tab"]'), 20));
				code_tab.click();
			})
		})
	});

	let push_process = vscode.commands.registerCommand('ece408-remote-control.push', function () {
		// transfer the local file onto the webpage
		push_code_and_run();
		// pull down the whole HTML source code and save in an HTML file (render it yourself)
		// download_html(driver);
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
