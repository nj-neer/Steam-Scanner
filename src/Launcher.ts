declare const Promise: any;
import * as fs from "fs-extra";
import * as _ from "lodash";

import * as path from "path";
import * as recursive from "recursive-readdir";

import { ScannerHelpers } from "./ScannerHelpers";
import * as colors from "colors";
import { LauncherManager } from "./LauncherManager";
import { Config } from "./Config";

const helper: ScannerHelpers = new ScannerHelpers();
const config: Config = new Config();

//retrieve the known binaries list
let knownGamesList, launcherConfig;
try {
  knownGamesList = require("./games.json");
} catch (e) {
  helper.error(colors.red("ERROR ! Unable to read the known games list"));
  helper.error(colors.red(e));
  helper.quitApp();
}

export class Launcher {
  public name: any;
  public binaryName: string;
  public binaryLocation: string;
  public configPath: string;
  public gamesInstallDirectory;
  public games: any;
  private binaryPossibleLocations: string[] = [];
  private gamesPossibleLocations: any[] = [];

  constructor(launcherItem: any) {
    this.name = launcherItem.name;
    this.binaryPossibleLocations = launcherItem.binaryPossibleLocations;
    this.gamesPossibleLocations = launcherItem.gamesPossibleLocations;
    this.binaryName = launcherItem.binaryName;
    this.games = {};
  }

  public async checkInstallation() {
    const launcherConfig: any = config.get("launcher." + this.name);
    // if the binary location is not defined, try to find it
    if (!launcherConfig || !launcherConfig.binaryLocation) {
      const parsedPossibleLocations: string[] = await helper.addDrivesToPossibleLocations(
        this.binaryPossibleLocations
      );

      // first we locate the drm directory
      for (let loc of parsedPossibleLocations) {
        loc = path.normalize(path.join(loc, this.binaryName));
        // try to list all the users in the userdata folder of steam
        if (fs.existsSync(loc)) {
          this.binaryLocation = loc;
          config.set("launcher." + this.name, this);
          break;
        }
      }
    } else {
      this.binaryLocation = launcherConfig.binaryLocation;
    }

    if (this.binaryLocation) {
      helper.log(colors.cyan(this.name + " located at " + this.binaryLocation));
    } else {
      helper.log(colors.yellow(this.name + " not found"));
    }
    return new Promise((resolve) => {
      resolve();
    });
  }

  public async getGames() {
    await this.getGamesDirectories();
    await this.getGamesBinaries();
    return new Promise((resolve) => {
      resolve();
    });
  }

  // use the found games directories
  private async getGamesDirectories() {
    for (const possibleLocation of this.gamesPossibleLocations) {
      possibleLocation.path = await helper.addDrivesToPossibleLocations([
        possibleLocation.path
      ]);

      for (const locationPath of possibleLocation.path) {
        /*
        two case possible here
        if uniqueGameFolder === true, scan exe, else scan folders
      */

        if (possibleLocation.uniqueGameFolder) {
          //game directory
          try {
            let dir = path.basename(locationPath);
            if (fs.pathExistsSync(locationPath)) {
              this.games[dir] = { directory: locationPath };
            }
          } catch (e) {
            // skip if the possible game folder don't exist
            continue;
          }
        } else {
          //Directory of games
          try {
            const items = fs.readdirSync(locationPath);
            // only keep the directories
            for (const dir of items) {
              const currentGameDir = path.normalize(
                path.join(locationPath, dir)
              );
              if (fs.lstatSync(currentGameDir).isDirectory()) {
                this.games[dir] = { directory: currentGameDir };
              }
            }
            // skip if the possible game folder don't exist
          } catch (e) {
            continue;
          }
        }
      }
    }

    return new Promise((resolve) => {
      resolve();
    });
  }

  /**
   * Find the games binary
   */
  private async getGamesBinaries() {
    let isKnownGame = false;
    for (const gameName in this.games) {
      const binariesPathList = [];
      if (this.games.hasOwnProperty(gameName)) {
        const gameItem = this.games[gameName];
        // set the game name based on his folder
        const parsedGamepath = path.parse(gameItem.directory);
        gameItem.name = parsedGamepath.name;

        const gameConfig: any = config.get(
          "launcher." + this.name + ".games." + gameName
        );

        // if game and his binary are already known => skip
        if (gameConfig && gameConfig.binary) {
          continue;
        }

        //check if the game is a "known" game :
        if (knownGamesList[gameItem.name]) {
          helper.log(
            colors.cyan(
              gameItem.name +
                " is a known game, trying to find one of the known executable..."
            )
          );
          //game is a known game, generate a list of possible binary location
          isKnownGame = true;
        }

        //clean the list of listened binaries
        config.set(
          "launcher." +
            this.name +
            ".games." +
            gameItem.name +
            ".listenedBinaries",
          null
        );

        // ignore files named "foo.cs" or files that end in ".html".
        const filesList = await recursive(gameItem.directory);
        filesListLoop: for (const fileName of filesList) {
          if (isKnownGame) {
            if (!knownGamesList[gameItem.name].binaries) {
              break;
            }
            //only search in known locations (from games.json)
            for (const binary of knownGamesList[gameItem.name].binaries) {
              //ex : c//program/overwatch/Overwatch.exe => Overwatch.exe
              if (fileName.search(binary) > -1) {
                binariesPathList.push(fileName);
                helper.log(colors.green(fileName + " FOUND !"));
                break filesListLoop; //stop everything, we found what we want, a known game executable
              }
            }
          }

          //reference all executables
          if (fileName.search(".exe") > -1) {
            binariesPathList.push(fileName);
          }
        }

        // if there is only one binaries, set it by default
        if (binariesPathList.length === 1) {
          let dm = new LauncherManager();

          config.set(
            "launcher." + this.name + ".games." + gameItem.name,
            gameItem
          );

          await dm.setBinaryForGame(
            this.name,
            gameItem.name,
            binariesPathList[0],
            false
          );
          this.games[gameName].binary = binariesPathList[0];

          continue;
        }

        //if there is more than one binary, add the list the the listenners
        if (binariesPathList.length > 1) {
          config.set(
            "launcher." + this.name + ".games." + gameItem.name,
            gameItem
          );

          /*
          Here, we will listen for an active process to have the same name than a binarie found in the game files
          add the game the the listener, things happend in "Scanner.ts"
        */
          helper.log("Trying to find the process for " + gameItem.name);

          config.set(
            "launcher." +
              this.name +
              ".games." +
              gameItem.name +
              ".listenedBinaries",
            binariesPathList
          );
        }
      }
    }

    return new Promise((resolve) => {
      resolve();
    });
  }
}