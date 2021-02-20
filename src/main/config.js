"use strict";

import { ipcMain, app } from "electron";
import fs from "fs-extra";
import log4js from "log4js";

const configFile = app.getPath("userData") + "/config.json";
const lp = log4js.getLogger("property");
let property = {};

fs.ensureFileSync(configFile);
property = fs.readJSONSync(configFile);
if (typeof property["language"] === "undefined") {
    lp.warn("Property language not exist, creating");
    let sysLang = app.getLocale().toLowerCase();
    if (sysLang.startsWith("zh")) {
        property["language"] = "zh-cn";
    } else if (sysLang.startsWith("ja")) {
        property["language"] = "ja-jp";
    } else {
        property["language"] = "en-us";
    }
}
if (typeof property["java-path"] === "undefined") {
    lp.warn("Property java-path not exist, creating");
    property["java-path"] = "java";
}
saveToDisk();

function saveToDisk() {
    fs.writeFileSync(configFile, JSON.stringify(property));
}

ipcMain.on("cache-get", ev => {
    lp.debug("Cache get triggered");
    ev.returnValue = property;
});

ipcMain.on("property-get", (ev, args) => {
    lp.debug("Property get triggered");
    ev.returnValue = property[args[0]];
});

ipcMain.on("property-set", (_ev, args) => {
    lp.debug("Property set triggered");
    property[args[0]] = args[1];
    saveToDisk();
});
