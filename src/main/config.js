"use strict";

import { ipcMain, app } from "electron";
import fs from "fs-extra";
import log4js from "log4js";

const userDataPath = app.getPath("userData");
const configFile = userDataPath + "/config.json";
const lp = log4js.getLogger("property");
let property = {};

fs.ensureFileSync(configFile);
try {
    property = fs.readJSONSync(configFile);
} catch (e) {
    property = {};
}
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
if (typeof property["title-theme"] === "undefined") {
    lp.warn("Property title-theme not exist, creating");
    property["title-theme"] = "eph";
}
saveToDisk();

function readConfig(key, def) {
    let val = property[key];
    if (typeof val === "undefined") {
        val = def;
    }
    return val;
}

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

export { readConfig };
