# ece408-remote-control README

## Features

Hello, our extension uses your code created locally onto VS Code and use them for posting on the webgpu website and automatically use it for running the tests online. Note that all 

> Tip: Many popular extensions utilize animations. This is an excellent way to show off your extension! We recommend short, focused animations that are easy to follow.

## Requirements

-   Please download the plug-in called `vscode-cudacpp` after you install this plug-in to gain full experience.
-   Please install `headless-chrome` or `chromedriver` into your system `PATH`.
    -   Note that you must download exactly the same version of `chromedriver` as your chrome browser if you want to use the `chromedriver` as your selenium driver.
    -   Note that the chrome browser is likely to be updated automatically when a new version is released. In this case, please update to the newest version of `chromedriver` too.
    -   We strongly recommend you to install the `chromedriver` into the system software directory immediately, i.e. it should appear in `/usr/local/bin/chromedriver`.

## Extension Settings

This extension contributes the following settings:

* `account`: your account name (Net ID for UIUC) for your WebGPU.
* `passwd`: your password for your WebGPU.
* `num_lab`: the number of lab you want to finish.

## Known Issues

-   Need to change selenium to headless mode.
-   Need to change the argument part for users.
-   Cannot open selenium because of some version errors.

## Contributions

If you want to contribute to the code, please contact Haob.19@intl.zju.edu.cn to gain access to the GitHub Repo.

To set up your development environment, please make the following steps;

```shell
npm install -g yo generator-code
yo code // then follow the default settings
npm install selenium-webdriver
```

Note that you still need to install the `chromedriver` to start your automata.

## Release Notes

### 0.0.1

-   Initial release of the project.
-   Created the marketplace position.

### 0.0.2

-   completed the login process.
-   Next step is to write the files using DOM in VS Code.

### 0.0.3

-   Added the GitHub Repository for the extension source file.

### 0.0.4

-   Updated the icon for the extension.
-   Initialized `push` execution.

### 0.7.0

-   Completed `login` execution.
-   Completed `exit` execution.
-   `pull` sledding comes to 50/100 %.
-   `push` sledding comes to 40/100 %.

