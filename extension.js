//=============================================================================
//
//   VS Code Extension for the lecture
//
//   "Applied Parallel Programming"
//
//   Jack BAI
//
//   Copyright (C) 2021 by Hepta Workshop
//
//-----------------------------------------------------------------------------
//
//                                License
//
//   This program is free software; you can redistribute it and/or
//   modify it under the terms of the GNU General Public License
//   as published by the Free Software Foundation; either version 2
//   of the License, or (at your option) any later version.
//
//   This program is distributed in the hope that it will be useful,
//   but WITHOUT ANY WARRANTY; without even the implied warranty of
//   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//   GNU General Public License for more details.
//
//   You should have received a copy of the GNU General Public License
//   along with this program; if not, write to the Free Software
//   Foundation, Inc., 51 Franklin Street, Fifth Floor,
//   Boston, MA  02110-1301, USA.
//
//=============================================================================

const vscode = require('vscode');


/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	//=============================================================================
	//
	//  GLOBAL PARAMETERS
	//
	//=============================================================================

	// This part of code will only be executed once when your extension is activated
	var account = vscode.workspace.getConfiguration('ece408').get('account');
	var passwd = vscode.workspace.getConfiguration('ece408').get('password');
	var num_lab = vscode.workspace.getConfiguration('ece408').get('lab_num');
	var machine = vscode.workspace.getConfiguration('ece408').get('machine')

	var addr_list = ['9999', '10001', '10002', '10003', '10010', '10004', '10005', '10011', '10124'];
	var addr;
	switch (num_lab)
	{
		case '0':
			addr = addr_list[0];
			break;
		case '1':
			addr = addr_list[1];
			break;
		case '2':
			addr = addr_list[2];
			break;
		case '3':
			addr = addr_list[3];
			break;
		case '4':
			addr = addr_list[4];
			break;
		case '5.1':
			addr = addr_list[5];
			break;
		case '5.2':
			addr = addr_list[6];
			break;
		case '6':
			addr = addr_list[7];
			break;
		case '7':
			addr = addr_list[8];
			break;
		default:
			break;
	}
	
	// flag to determine whether this is the first time for logging in
	var first_time_login = true;
	var output_channel = vscode.window.createOutputChannel("WebGPU");
	output_channel.show();

	// Initialization
	const {By, Key, until} = require('selenium-webdriver');
	var webdriver = require('selenium-webdriver');
	var driver = new webdriver.Builder()
		.forBrowser('chrome')
		.build();

	// driver.manage().window().maximize(); 

	//=============================================================================
	//
	//  HELPER FUNCTIONS
	//
	//=============================================================================

	function solve_potential_bad_ssl() {
		// website error handling (temporary)
		var advanced_button = driver.wait(until.elementLocated(By.xpath('//*[@id="details-button"]'), 20));
		advanced_button.click();
	
		var proceed_button = driver.wait(until.elementLocated(By.xpath('//*[@id="proceed-link"]'), 20));
		proceed_button.click();
	}

	function enter_information() {
		var login_button = driver.wait(until.elementLocated(By.xpath('//*[@id="content"]/div/div/div/div[3]/a[2]/div'), 20));
		login_button.click();

		var account_box = driver.wait(until.elementLocated(By.xpath('//*[@id="user_name"]'), 20));
		account_box.sendKeys(account);

		var passwd_box = driver.wait(until.elementLocated(By.xpath('//*[@id="password"]'), 20));
		passwd_box.sendKeys(passwd);
	}

	function go_to_lab_page() {
		driver.get('https://www.webgpu.net/mp/' + addr);
		var code_tab = driver.wait(until.elementLocated(By.xpath('//*[@id="code-tab"]'), 20));
		code_tab.click()
		.then(function(){
			output_channel.appendLine("Successfully logged in and accesses Lab" + num_lab.toString() + ".");
		})
	}

	function save_file(code){
		const fs = require('fs');
		const currentlyOpenTabfilePath = vscode.window.activeTextEditor.document.fileName;
		fs.truncateSync(currentlyOpenTabfilePath);
		fs.appendFileSync(currentlyOpenTabfilePath, code);
	}

	function copy_to_clipboard(){
		var exec = require('child_process').exec;
		var spawn = require('child_process').spawn;
		const currentlyOpenTabfilePath = vscode.window.activeTextEditor.document.fileName;
		if (machine == 'mac'){
			exec(`cat ${currentlyOpenTabfilePath} | pbcopy`);
		} else {
			spawn('cmd.exe', ['/c', `type ${currentlyOpenTabfilePath} | clip`]);
		}
	}

	function compile_has_finished(driver){
		if (driver.findElement(By.xpath('/html/body/div[4]/h2')).isDisplayed()) // stderr, "compilation failer"
			return true;
		if (driver.findElement(By.xpath('/html/body/div[1]/div[3]/div[1]/div/h3')).isDisplayed()) // stdout, "Attempt Summary"
			return true;
		return false;
	}

	function redirect_stderr(driver){
		var err_box = driver.wait(until.elementLocated(By.xpath('/html/body/div[4]/p/pre'), 20));
		var err_msg = err_box.get_attribute('innerHTML');
		output_channel.appendLine("The error message is " + err_msg);
	}

	function redirect_stdout(currentUrl){
		// work with the current url of browser
		const rp = require('request-promise');
		var html_source = rp(currentUrl);
		html_source.then(function(html_source){
			// save the file to ./feedback.html
			const fs = require('fs');
			const current_open_file_path = vscode.window.activeTextEditor.document.fileName;
			const index = current_open_file_path.lastIndexOf("\/");  
			const html_file_path = current_open_file_path.substring(0, index+1) + "/feedback.html";
			output_channel.appendLine("The file path is " + html_file_path);
			fs.truncateSync(html_file_path);
			fs.appendFileSync(html_file_path, html_source);
		});
	}

	function feedback(){
		output_channel.appendLine("Reminder: please save your .cu file before you run.");
		output_channel.appendLine("Running your code...");
		driver.wait(function() {
			return compile_has_finished(driver);
		}, 20)
			.then(function() {
				return driver.getCurrentUrl();
			})
			.then(function(currentUrl) {
				if (currentUrl == 'https://www.webgpu.net/mp/' + addr)
					redirect_stderr(driver);
				else
					redirect_stdout(currentUrl);
			});
	}


	//=============================================================================
	//
	//  CALLER FUNCTIONS
	//
	//=============================================================================

	let login_process = vscode.commands.registerCommand('ece408-remote-control.login', function () {
		if (num_lab == 'null') {
			output_channel.appendLine("Error: please input your account and password first!");
			return;
		}

		// Certify the website
		output_channel.appendLine("Logging into your WebGPU account and accessing Lab" + num_lab.toString() + "...");
		driver.get('https://www.webgpu.net/');
		solve_potential_bad_ssl();
		if (first_time_login == true)
		{
			enter_information();
			var confirm_login_button = driver.wait(until.elementLocated(By.xpath('/html/body/div/div/div/form/div[3]/div/button'), 20));
			confirm_login_button.click()
			.then(function(){
				go_to_lab_page();
			})
		} else {
			driver.wait(function() {
				return driver.findElement(By.xpath('//*[@id="content"]/div/div')).isDisplayed();
			}, 20)
			.then(function() {
				go_to_lab_page();
			})
		}
		first_time_login = false;
	});

	let pull_process = vscode.commands.registerCommand('ece408-remote-control.pull', function () {
		// get the code
		output_channel.appendLine("Pulling the latest code on WebGPU from Lab " + num_lab.toString() + ".");
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
				code_tab.click()
				.then(function(){
					output_channel.appendLine("Successfully pulled code in Lab " + num_lab.toString() + ".");
				})
			})
		})
	});

	let push_process = vscode.commands.registerCommand('ece408-remote-control.push', function () {
		// copy the content in the workspace to the clipboard
		copy_to_clipboard();

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
			.click(compile_button)
			.click(all_button)
			.perform()
			.then(function(){
				// download feedback
				feedback();
			});
		} else {
			actions
			.click(code_line)
			.keyDown(Key.CONTROL)
			.sendKeys('a')
			.sendKeys('v')
			.sendKeys('s')
			.keyUp(Key.CONTROL)
			.click(compile_button)
			.click(all_button)
			.perform()
			.then(function(){
				// download feedback
				feedback();
			})
		}
	});

	let exit_process = vscode.commands.registerCommand('ece408-remote-control.exit', function () {
		driver.quit();
		output_channel.appendLine("You've successfully exit your account!");
	});

	for (let item in {login_process, pull_process, push_process, exit_process})
		context.subscriptions.push(item);
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
