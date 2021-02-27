"use strict";

import { ipcMain, dialog, app, BrowserWindow } from "electron";
import { win } from "@/background";

app.commandLine.appendSwitch("disable-http-cache");

const userDataPath = app.getPath("userData");

ipcMain.on("open-dir-browse-dialog", () => {
    dialog
        .showOpenDialog(win, {
            properties: ["openDirectory"],
        })
        .then(data => {
            win.webContents.send("close-dir-browse-dialog", data);
        });
});

ipcMain.on("ms-auth", () => {
    let msWin = new BrowserWindow({
        width: 750,
        height: 750,
        backgroundColor: "#e0e0e0",
        webPreferences: {
            nodeIntegration: false,
        },
    });
    msWin.webContents.session.clearCache();
    msWin.loadURL(
        "https://login.live.com/oauth20_authorize.srf?client_id=00000000402b5328&response_type=code&scope=service%3A%3Auser.auth.xboxlive.com%3A%3AMBI_SSL&redirect_uri=https%3A%2F%2Flogin.live.com%2Foauth20_desktop.srf"
    );
    msWin.webContents.once("did-redirect-navigation", (_ev, url) => {
        if (url.indexOf("login.live.com") !== -1) {
            let spl_ = url.split("?");
            let spl = spl_[spl_.length - 1].split("&");
            for (let i in spl) {
                let s = spl[i];
                if (s.startsWith("code=")) {
                    win.webContents.send("ms-auth", s.substr(5, s.length));
                    msWin.close();
                }
            }
        }
    });
});

ipcMain.on("get-basic-vars", ev => {
    ev.returnValue = [userDataPath, process.env.JAVA_HOME];
});

function getWindowSettings(theme) {
    if (theme === "eph") {
        return {
            width: 800,
            height: 600,
            backgroundColor: "#e0e0e0",
            autoHideMenuBar: true,
            titleBarStyle: "hidden",
            webPreferences: {
                nodeIntegration: true,
                webSecurity: false,
            },
        };
    }
    return {
        width: 800,
        height: 600,
        backgroundColor: "#e0e0e0",
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true,
            webSecurity: false,
        },
    };
}

export { getWindowSettings };
