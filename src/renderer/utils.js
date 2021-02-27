"use strict";

const JWT_META_BASE64 = "eyJhbGciOiAiTk9ORSIsICJ0eXBlIjogIkpXVCJ9";

// get element from id
function e(id) {
    return document.getElementById(id);
}

function genUUID() {
    let result = "";
    for (let j = 0; j < 32; j++) {
        let i = Math.floor(Math.random() * 16)
            .toString(16)
            .toLowerCase();
        result = result + i;
    }
    // return a string with 32 chars
    return result;
}

function genOfflineToken(name) {
    let payload = {
        name: encodeURIComponent(name),
    };
    return `${JWT_META_BASE64}.${btoa(JSON.stringify(payload))}.${Math.random()}`;
}

function isEmpty(str) {
    return str.trim() === "" || typeof str === "undefined" || str === null;
}

function isNotEmpty(str) {
    return !isEmpty(str);
}

function removePrefix(former, prefix) {
    if (former.startsWith(prefix)) {
        return former.substring(prefix.length, former.length);
    } else {
        return former;
    }
}

function removeSuffix(former, suffix) {
    if (former.endsWith(suffix)) {
        return former.substring(0, former.length - suffix.length);
    } else {
        return former;
    }
}

// resolve url of authentication server
function resolveAuthServerURL(server) {
    let url = removeSuffix(server, "/");
    let ret = "";
    if (url.indexOf("authserver") === -1) {
        // no "authserver" in url, add it
        ret = url + "/authserver";
    }
    return ret;
}

// get element by "id"
function getArrayElementById(arr, id) {
    for (let i in arr) {
        if (arr[i]["id"] === id) {
            return arr[i];
        }
    }
    return undefined;
}

// get index by "id"
function getArrayIndexById(arr, id) {
    for (let i in arr) {
        if (arr[i]["id"] === id) {
            return i;
        }
    }
    return undefined;
}

// get "id" of the last item and plus 1
function getArrayNewElementId(arr) {
    let len = arr.length;
    return len === 0 ? 0 : arr[len - 1]["id"] + 1;
}

// search the first element in array who have param "par" and "par" === "val"
function getArrayElementByParam(arr, par, val) {
    for (let i in arr) {
        let e = arr[i];
        if (e[par] === val) {
            return e;
        }
    }
    return undefined;
}

export {
    e,
    genUUID,
    genOfflineToken,
    isEmpty,
    isNotEmpty,
    removeSuffix,
    removePrefix,
    resolveAuthServerURL,
    getArrayElementById,
    getArrayNewElementId,
    getArrayElementByParam,
    getArrayIndexById,
};
