"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const electron = require("electron");
const path = require("node:path");
const child_process = require("child_process");
const DIST = path.join(__dirname, "../dist");
const VITE_PUBLIC = electron.app.isPackaged ? DIST : path.join(DIST, "../public");
process.env.DIST = DIST;
process.env.VITE_PUBLIC = VITE_PUBLIC;
electron.ipcMain.on("trigger-shortcut", (event, shortcut) => {
  const executablePath = path.join(__dirname, "shortcut1.exe");
  const command = `"${executablePath}" "${shortcut}"`;
  child_process.exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error.message}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
  });
});
exports.win = null;
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
function createWindow() {
  exports.win = new electron.BrowserWindow({
    alwaysOnTop: true,
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js")
    }
  });
  exports.win.webContents.on("did-finish-load", () => {
    var _a;
    (_a = exports.win) == null ? void 0 : _a.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  if (VITE_DEV_SERVER_URL) {
    exports.win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    exports.win.loadFile(path.join(process.env.DIST, "index.html"));
  }
}
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electron.app.quit();
    exports.win = null;
  }
});
electron.app.on("activate", () => {
  if (electron.BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
electron.app.whenReady().then(createWindow);
Object.defineProperty(exports, "BrowserWindow", {
  enumerable: true,
  get: () => electron.BrowserWindow
});
