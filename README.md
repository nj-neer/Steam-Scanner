# Steam Scanner

<img src="./src/assets/scanner.png" width="128px" height="128px">

[![GitHub version](https://badge.fury.io/gh/nj-neer%2FSteam-Scanner.svg)](https://github.com/nj-neer/Steam-Scanner/releases/latest)
[![Build status](https://ci.appveyor.com/api/projects/status/la08lmcifr0q6r9q?svg=true)](https://ci.appveyor.com/project/Cyriaqu3/steam-scanner)
<a href="https://codeclimate.com/github/nj-neer/Steam-Scanner/maintainability"><img src="https://api.codeclimate.com/v1/badges/6e18e92248d930d4d7d5/maintainability" /></a>

### Get all you games on Steam ! 

Steam Scanner run as a background process, grab games from others launchers and add them to your Steam library.

It is available from the system tray

![](./src/assets/screen-tray.png)

| Table of contents                        |
| ---------------------------------------- |
| [Downloads](#downloads)                  |
| [Supported OS](#supported-os)            |
| [Supported Launcher](#supported-drm)     |
| [Dev prerequisites](#dev-prerequisites)  |
| [Scripts](#scripts)  |
| [Known bugs](#known-bugs)                |

## Downloads

### Go to the **[Releases](https://github.com/nj-neer/Steam-Scanner/releases/latest)** section

## Supported OS

Only **Windows** is supported

## Supported Launcher

| Launcher                                                                          | Supported |
| --------------------------------------------------------------------------------- | --------- |
| <img src="https://i.imgur.com/C0PYnQH.png" width="18px" height="18px"> Uplay      | ✔️        |
| <img src="https://i.imgur.com/0iLlyMK.png" width="18px" height="18px"> Origin     | ✔️        |
| <img src="https://i.imgur.com/ffu3VTv.png" width="18px" height="18px"> BattleNet  | 🔁 WIP    |
| <img src="https://i.imgur.com/ES8Pr1w.png" width="18px" height="18px"> GOG Galaxy | ❌        |
| <img src="https://i.imgur.com/zN8Cdvs.png" width="18px" height="18px"> Twitch DA  | ❌        |
| <img src="https://i.imgur.com/KUhFAXu.png"  width="18px" height="18px"> MS Store  | ❌        |

## Dev Prerequisites

_For windows, as admin_

```
npm install --global --production windows-build-tools
```

## Scripts

### `npm run dev`

Launch webpack and watch for changes

### `npm run electron`

Run the compiled app from the **`dist`** folder

### `npm run build`

Build the app and a setup executable


## Launch parameters (WIP)

The following launch parameters are available :

|           |                                                             |
| --------- | ----------------------------------------------------------- |
| - - clean | Clear the saved config and all shortcuts saved on Steam     |
| - - debug | Show additionnal outputs in the console (like updater logs) |


## Known bugs

- ()