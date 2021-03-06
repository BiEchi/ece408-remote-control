# Change Log

All notable changes to the "ece408-remote-control" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.



## [1.8.5] - 2022.1.30

### Changed

-   Changed icon.



## [1.8.2] - 2022.1.29

### Changed

-   Changed displayed name and icon.



## [1.8.2] - 2021.10.28

### Added

-   Added the system to avoid ssl failure interruption when executing the `pull` operation.



## [1.6.0] - 2021-10.24

### Removed

-   Becaise SSL is back to life on the server, we delete the corresponding solver code.

### Changed

-   Due to ambiguity, we change the name to **VSC-WebGPU** from VSC-GPU.



## [1.5.2] - 2021-10.14

### Changed

-   The name from `ECE408 Remote Control` to `VSC-GPU`.



## [1.5.0] - 2021-10.14

### Added

-   Detailed process feedback on the OUTPUT channel.
-   Synchronization on `promise` objects.
-   The option to choose to be `headless` or not. (not stable).
-   The browser open/close automation.

### Changed

-   Resolved potential issues due to asynchronization.



## [1.2.0] - 2021-10-14

### Added

-   A more strict method for detecting whether already accessed the proposed website.

### Changed

-   The `vscode.window.showInformation()` method to `startOutputChannel()` method.



## [1.1.0] - 2021-10-13

### Added

-   The `config` file to avoid typing in information every time.

### Changed

-   The README file about the `config` part.
-   The route for MP 5.1 and MP 5.2.
-   The shortcuts for `login` and `pull` commands due to delete of `config` command.

### Removed

-   The `config` command.



## [1.0.4] - 2021-10-10

### Added

-   Trouble-shotting part in [README](./README.md).
-   Production support for Mac users.



## [1.0.1] - 2021-10-10

### Added

-   Production support for Windows users.



## [1.0.0] - 2021-10-10 {MILESTONE}

### Added

-   The automated pushing system.
-   Version Navigation.
-   Complete installation GIF files.
-   CHANGELOG.
-   Added `.then()` functionalities to improve robustness.
-   Added `push` functionality.
-   The acknowledgement part in `README.md`.
-   **The CP-CI integration onto GitHub.**

###  Changed

-   The extension icon.
-   Fixed bugs in the `config` part.
-   Merged unnecessary functions in `push`.

### Removed

-   The HTML downloading and  rendering part in `push` (will be re-added later).
-   The code reading part in `push`.



## [0.9.6] - 2021-10-7

### Changed

-   The extension icon.



## [0.9.5] - 2021-10-6

### Added

-   The code reading part in `push`.
-   The HTML downloading and rendering part in `push`.

### Changed

-   Fixed some bugs in `pull`.
-   Revised the workflow and almost completed `README.md`.



## [0.9.2] - 2021.10.1

### Changed

-   Fixed the bugs on the beginning of the code.



## [0.9.0] - 2021.9.27

### Added

-   Completed `config` execution, which allows users to input their account and password.



## [0.8.0] - 2021.9.24

### Added

-   Completed `pull` execution.

### Changed

-   Reconstructed the functions using subroutines and system decomposition.



## [0.7.0] - 2021.9.21 {MILESTONE}

### Added

-   Completed `login` execution.
-   Completed `exit` execution.
-   `pull` sledding comes to 50/100 %.
-   `push` sledding comes to 40/100 %.



## [0.4.0] - 2021.9.16

### Added

-   Initialized `push` execution.

### Changed

-   Updated the icon for the extension.



## [0.3.0] - 2021.9.14

### Added

-   Added the GitHub Repository for the extension source file VCS.



## [0.2.0] - 2021.9.13

### Changed

-   Completed the login process.
-   Next step is to write the files using DOM in VS Code.



## [0.1.0] - 2021.9.10

### Added

-   Initial ???release??? of the project.
-   Created the marketplace position.

