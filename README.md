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
npm install
```
### Install the Chrome driver

You also need to install `chromedriver` into your system `PATH`.

-   You must download exactly the same version of `chromedriver` as your chrome browser if you want to use the `chromedriver` as your selenium driver. The chrome browser on your machine is likely to be updated automatically when a new version is released. In this case, please update to the newest version of `chromedriver` too.
-   I strongly recommend you to install the `chromedriver` into the system software directory immediately, i.e. it should appear in `/usr/local/bin/chromedriver`.

### Install the other extensions

In your VS Code workspace, please install the following extensions:

-   `vscode-cudacpp`: CUDA C++ syntax highlight.

### Set up your working directory

When starting, you should use the VS Code to open your `.cu` CUDA source 

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

For the Release Notes part, please refer to [CHANGELOG](./CHANGELOG.md) for details.
