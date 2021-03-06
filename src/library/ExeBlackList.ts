/**
 * List of the executables that should **never** be used as the main game executable
 */
const exeBlackList: string[] = [
    "Cleanup.exe",
    "cleanup.exe",
    "vc_redist.x64.exe",
    "vc_redist.x86.exe",
    "vcredist_x64.exe",
    "crashmsg.exe",
    "crashhandler.exe",
    "vcredist_x86.exe",
    "vcredist120.exe",
    "vcredist120_x64.exe",
    "vcredist120_x86.exe",
    "DXSETUP.exe",
    "dxsetup.exe",
    "Touchup.exe",
    "touchup.exe",
    "pbsvc.exe",
    "UnityCrashHandler.exe",
    "UnityCrashHandler64.exe",
    "CrashReportClient.exe",
    "EasyAntiCheat_Setup.exe",
    "EasyAntiCheat_launcher.exe",
    "UplayInstaller.exe",
];

export default exeBlackList;