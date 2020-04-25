import { defaultConfig } from "./utils/config.utils";
import { readJsonSync, writeJsonSync, ensureDirSync, readJSONSync } from "fs-extra";
import IConfig from "./interfaces/Config.interface";
import path from "path";
import { app } from "electron";
import { log, logWarn, logError } from "./utils/helper.utils";
const appName = "steam-scanner";
import SteamScanner from "./app";
import { ILaunchersCollection } from "./interfaces/Launcher.interface";

/**
 * Class that manage the config
 */
export default class Config {
    private _enableNotifications: boolean = defaultConfig.enableNotifications;
    private _launchOnStartup: boolean = defaultConfig.launchOnStartup;
    private _steamDirectory: string = defaultConfig.steamDirectory;
    private _steamExe: string = defaultConfig.steamExe;
    private _launchers: any = defaultConfig.launchers;
    private scanner: SteamScanner;
    version: string = "0.0.0";
    configPath = path.join(app.getPath("appData"), appName);
    configFilePath = path.join(this.configPath, "config.json")

    get enableNotifications(): boolean {
        return this._enableNotifications;
    }

    set enableNotifications(value: boolean) {
        this._enableNotifications = value;
        this.writeConfig();
    }

    get launchOnStartup(): boolean {
        return this._launchOnStartup;
    }

    set launchOnStartup(value: boolean) {
        this._launchOnStartup = value;
        this.writeConfig();
    }

    set steamExe(value: string) {
        this._steamExe = value;
        this.writeConfig();
    }

    get steamExe(): string {
        return this._steamExe;
    }

    get steamDirectory(): string {
        return this._steamDirectory;
    }

    set steamDirectory(value: string) {
        this._steamDirectory = value;
        this.writeConfig();
    }

    get launchers(): ILaunchersCollection {
        return this._launchers;
    }

    set launchers(value: ILaunchersCollection) {
        this._launchers = value;
        this.writeConfig();
    }

    constructor(scanner: SteamScanner) {
        this.scanner = scanner;
        this.version = this.getVersion();
        this.load();
    }

    /**
     * Retrieve the current saved config and assign it to the class
     *
     * If unable to load the config, it will generate a clean one
     */
    private load() {
        try {
            const config = readJsonSync(this.configFilePath) as IConfig;
            this.enableNotifications = config.enableNotifications;
            this.launchers = config.launchers;
            this.launchOnStartup = config.launchOnStartup;
            this.steamDirectory = config.steamDirectory;
        } catch (error) {
            logWarn("Unable to load the config");
            const config = this.writeDefaultConfig();
            return config;
        }
    }


    /**
     * Write the current config to the config file
     */
    private writeConfig() {

        const configToWrite: IConfig = {
            launchOnStartup: this._launchOnStartup,
            steamDirectory: this._steamDirectory,
            launchers: this._launchers,
            steamExe: this._steamExe,
            enableNotifications: this._enableNotifications
        }
        try {
            writeJsonSync(this.configFilePath, configToWrite);
            // reload the system tray
            if (this.scanner.trayManager) {
                this.scanner.trayManager.setTray();
            }

        } catch (error) {
            logError(error);
            logError("Unable to write the config !");
        }
    }

    /**
     * Retrieve the version number from the package json file
     */
    private getVersion(): string {
        try {
            const data = readJSONSync(path.join(app.getAppPath(), "package.json"));
            if (!data || !data.version) {
                throw new Error("Unable to read version number, this is critical !");
            }
            return data.version;
        } catch (error) {
            logError(error);
            app.quit();
            return this.version;
        }

    }

    /**
     * Write a default config file
     * @return Written config data
     */
    private writeDefaultConfig(): IConfig {

        try {
            ensureDirSync(this.configPath);
            writeJsonSync(this.configFilePath, defaultConfig);
            log("The config has been reset");
            return defaultConfig;
        } catch (error) {
            // Unable to write the config, should crash
            logError(error);
            logError("Unable to write a config file, this is critical !!!\nThe process will now close")
            process.exit(0);
        }
    }

}