import { ILaunchersCollection } from "./Launcher.interface";

export default interface IConfig {
  steamDirectory: string;
  steamExe: string;
  launchers: ILaunchersCollection;
  launchOnStartup: boolean;
  enableNotifications: boolean;
  autoRestartSteam: boolean;
  firstLaunch: boolean;
  apiUrl: string;
  steamGridDbToken?: string;
  enableGrid: boolean;
  animatedCover: boolean;
}
