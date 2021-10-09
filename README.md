# ece408-remote-control README

```shell
Author = Jack BAI, ZJUI Junior
ContactEmail = Haob2@illinois.edu
```

## Functionality

My extension uses your code created locally onto VS Code and use them for posting on the webgpu website and automatically use it for running the tests online.

## Getting started

Before you can use the extension, there are some setting-up steps to follow.

### Install the NPM dependencies

```shell
npm install fs
npm install selenium-webdriver
npm install request
npm install request-promise
```
### Install the Chrome driver

You also need to install `headless-chrome` or `chromedriver` into your system `PATH`.

-   Note that you must download exactly the same version of `chromedriver` as your chrome browser if you want to use the `chromedriver` as your selenium driver.
-   Note that the chrome browser is likely to be updated automatically when a new version is released. In this case, please update to the newest version of `chromedriver` too.
-   We strongly recommend you to install the `chromedriver` into the system software directory immediately, i.e. it should appear in `/usr/local/bin/chromedriver`.

### Install the other extensions

In your VS Code workspace, please install the following extensions:

-   `vscode-cudacpp`: CUDA C++ syntax highlight.
-   `Live Server`: Local rendering of feedback HTML files.

### Set up your working directory

In your working directory, make two empty files called `feedback.html` and `lab.cu` respectively.

```shell
./ece408mps
|- feedback.html
|- lab.cu
```

## Features

- ctrl+shift+P, then enter `config`:
    - `account`: your account name (Net ID for UIUC) for your WebGPU.
    - `passwd`: your password for your WebGPU.`num_lab`: the number of lab you want to finish.
- ctrl+shift+P, then enter `login`.
- ctrl+shift+P, then enter `pull`.
- ctrl+shift+P, then enter `push`.
- ctrl+shift+P, then enter `exit`.

## Known Issues

-   (GLOBAL) Need to change selenium to headless mode.
-   (PULL) Need to betterfy connecttion with the server.
    -   A possible solution is to change the code to pull down the website from the weisite without `/program`, because accessing a new website (i.e. `.../program`) takes time.
-   **(PUSH) Cannot push your code back to the WebGPU website.**
-   (PUSH) Need to download only contents above the “Program Code” part.

## Contributions

If you want to contribute to the code, please contact Haob.19@intl.zju.edu.cn to gain access to the [GitHub Repo](https://github.com/BiEchi/ece408-remote-control).

Before you start, please make sure you’ve already completed all steps in the *requirements* part.

### Set up your working environment

```shell
npm install -g yo generator-code
yo code // then follow the default settings
```

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

### 0.7.0 - BREAKTHROUGH 1

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

### 0.9.5

-   Completed all parts in the `push` execution except for pushing the code to the remote website.
-   Revised the workflow and almost completed `README.md`.

### 0.9.6

-   Renewed the icon.
