"use strict";

import { app, protocol, BrowserWindow } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";
import log4js from "log4js";
import os from "os";
import "@/main/config";
import "@/main/system";

const isDevelopment = process.env.NODE_ENV !== "production";
const userDataPath = app.getPath("userData");

log4js.configure({
    appenders: {
        out: { type: "stdout" },
    },
    categories: {
        starter: { appenders: ["out"], level: "debug" },
        property: { appenders: ["out"], level: "debug" },
        default: { appenders: ["out"], level: "debug" },
    },
});

const l = log4js.getLogger("starter");

l.info(`*** Epherome 0.0.1 ***`);
l.info(`Operating System: ${os.platform()} ${os.arch()} ${os.release()}`);
l.info("Node Version: " + process.versions.node);
l.info("Chrome Version: " + process.versions.chrome);
l.info("Electron Version: " + process.versions.electron);
l.info("V8 Version: " + process.versions.v8);
l.info("Current Directory: " + process.cwd());
l.info("User Data Directory: " + userDataPath);
process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";

protocol.registerSchemesAsPrivileged([
    { scheme: "app", privileges: { secure: true, standard: true } },
]);

let win = undefined;

async function createWindow() {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        backgroundColor: "#e0e0e0",
        autoHideMenuBar: true,
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            webSecurity: false,
        },
    });

    if (process.env.WEBPACK_DEV_SERVER_URL) {
        await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    } else {
        createProtocol("app");
        await win.loadURL("app://./index.html");
    }

    win.on("ready-to-show", () => {
        win.webContents.send("get-basic-vars", [userDataPath, process.env.JAVA_HOME]);
    });
}

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on("ready", async () => {
    if (isDevelopment && !process.env.IS_TEST) {
        try {
            await installExtension(VUEJS_DEVTOOLS);
        } catch (e) {
            console.error("Vue Devtools failed to install:", e.toString());
        }
    }
    createWindow();
});

if (isDevelopment) {
    if (process.platform === "win32") {
        process.on("message", data => {
            if (data === "graceful-exit") {
                app.quit();
            }
        });
    } else {
        process.on("SIGTERM", () => {
            app.quit();
        });
    }
}

export { log4js, win };
