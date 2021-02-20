"use strict";

import { ipcMain, dialog } from "electron";
import { win } from "@/background";

ipcMain.on("open-dir-browse-dialog", () => {
    dialog
        .showOpenDialog(win, {
            properties: ["openDirectory"],
        })
        .then(data => {
            win.webContents.send("close-dir-browse-dialog", data);
        });
});
