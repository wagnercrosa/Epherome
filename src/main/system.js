"use strict";

import { ipcMain, dialog, app } from "electron";
import { win } from "@/background";

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
