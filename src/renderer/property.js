"use strict";

import { ipcRenderer } from "electron";
import { getArrayIndexById } from "@/renderer/utils";

let cache = undefined;

function readProperty(key, def = undefined) {
    if (typeof cache === "undefined") {
        cache = ipcRenderer.sendSync("cache-get");
    }
    let ret = cache[key];
    if (typeof ret === "undefined") {
        ret = def;
    }
    return ret;
}

function writeProperty(key, val) {
    // write to cache
    cache[key] = val;
    // write to disk
    ipcRenderer.send("property-set", [key, val]);
}

/**
 * act: function(obj), return obj
 */
function operateProperty(key, act, def) {
    let val = readProperty(key);
    // check if the value is not defined
    if (typeof val === "undefined") {
        val = def;
    }
    writeProperty(key, act(val));
}

function pushFromProperty(key, obj, def = []) {
    let val = readProperty(key);
    if (typeof val === "undefined") {
        val = def;
    }
    val.push(obj);
    writeProperty(key, val);
}

function removeFromPropertyById(key, id, def = []) {
    let val = readProperty(key);
    if (typeof val === "undefined") {
        val = def;
    }
    val.remove(getArrayIndexById(id));
    writeProperty(key, val);
}

export { readProperty, writeProperty, operateProperty, pushFromProperty, removeFromPropertyById };
