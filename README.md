# ece408-remote-control README

## Features

Hello, our extension uses your code created locally onto VS Code and use them for posting on the webgpu website and automatically use it for running the tests online. Note that all.

## Steps
- ctrl+shift+P, then `config`:
- * `account`: your account name (Net ID for UIUC) for your WebGPU.
- * `passwd`: your password for your WebGPU.
- * `num_lab`: the number of lab you want to finish.
- ctrl+shift+P, then `login`.
- ctrl+shift+P, then `pull`.
- ctrl+shift+P, then `push`.
- ctrl+shift+P, then `exit`.

## Requirements

-   Please install the npm tools before you use this extension.
```shell
npm install fs
npm install selenium-webdriver
```
-   Please download the plug-in called `vscode-cudacpp` after you install this plug-in to gain full experience.
-   Please download the plug-in called `live server` after you install this plug-in to activate the feedback rendering.
-   Please install `headless-chrome` or `chromedriver` into your system `PATH`.
    -   Note that you must download exactly the same version of `chromedriver` as your chrome browser if you want to use the `chromedriver` as your selenium driver.
    -   Note that the chrome browser is likely to be updated automatically when a new version is released. In this case, please update to the newest version of `chromedriver` too.
    -   We strongly recommend you to install the `chromedriver` into the system software directory immediately, i.e. it should appear in `/usr/local/bin/chromedriver`.

## Known Issues

-   Need to change selenium to headless mode.
-   **FATAL: Cannot open selenium because of some version errors.****

## Contributions

If you want to contribute to the code, please contact Haob.19@intl.zju.edu.cn to gain access to the GitHub Repo.

To set up your development environment, please make the following steps;

```shell
npm install -g yo generator-code
yo code // then follow the default settings
npm install selenium-webdriver
```

Note that you still need to install the `chromedriver` to start your automata.

To renew versions on the VS Code Extension Marketplace, please type 

```shell
npm i vsce -g # if you did not install vsce
vsce package # if you want to make a package
vsce publish # if you want to publish immediately
```

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

### 0.8.0

-   Completed `pull` execution.
-   Reconstructed the functions using subroutines and system decomposition.

### 0.9.0

-   Completed `config` execution, which allows users to input their account and password.

### 0.9.2

-   Fixed the bugs on the beginning of the code.
