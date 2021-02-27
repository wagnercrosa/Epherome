"use strict";

import { ipcRenderer } from "electron";
import path from "path";
import Vue from "vue";
import VueRouter from "vue-router";
import VueI18n from "vue-i18n";
import log4js from "log4js";
import vuetify from "@/plugins/vuetify";
import App from "@/App";
import "@mdi/font/css/materialdesignicons.min.css";
import "material-design-icons-iconfont/dist/material-design-icons.css";
import "typeface-roboto/index.css";
import "animate.css/animate.min.css";

// get some basic variables from the main process
let configFile = "";
let logFile = "";
let javaHome = "";
let args = ipcRenderer.sendSync("get-basic-vars", []);
configFile = args[0] + path.sep + "config.json";
logFile = args[0] + path.sep + "latest.log";
javaHome = args[1];

log4js.configure({
    appenders: {
        out: { type: "stdout" },
        file: {
            type: "file",
            filename: logFile,
        },
    },
    categories: {
        index: { appenders: ["out", "file"], level: "debug" },
        auth: { appenders: ["out", "file"], level: "debug" },
        route: { appenders: ["out", "file"], level: "debug" },
        core: { appenders: ["out", "file"], level: "debug" },
        minecraft: { appenders: ["out", "file"], level: "debug" },
        default: { appenders: ["out", "file"], level: "debug" },
    },
});

const { readProperty } = require("@/renderer/property");
const { onRouteChange } = require("@/renderer/route");

// init logger
const li = log4js.getLogger("index");

li.info("### Web Page Started to Load ###");

// initialize vue plugin
Vue.use(VueRouter);
Vue.use(VueI18n);

const router = new VueRouter({
    routes: [
        {
            path: "/",
            component: () => import("@/components/Home"), // router lazy load
        },
        {
            path: "/installer",
            component: () => import("@/components/Installer"),
        },
        {
            path: "/accounts",
            component: () => import("@/components/Accounts"),
        },
        {
            path: "/profiles",
            component: () => import("@/components/Profiles"),
        },
        {
            path: "/settings",
            component: () => import("@/components/Settings"),
        },
        {
            path: "/accounts/new-acc",
            component: () => import("@/components/NewAccount"),
        },
        {
            path: "/profiles/new-pro",
            component: () => import("@/components/NewProfile"),
        },
    ],
});

const i18n = new VueI18n({
    locale: readProperty("language"),
    messages: {
        "zh-cn": require("@/assets/lang/zh_cn.json"),
        "en-us": require("@/assets/lang/en_us.json"),
        "ja-jp": require("@/assets/lang/ja_jp.json"),
        ww: {
            "zh-cn": "中文简体",
            "en-us": "English",
            "ja-jp": "日本語",
        },
    },
});

new Vue({
    vuetify,
    router,
    i18n,
    render: h => {
        return h(App);
    },
}).$mount("#app");

if (readProperty("installed") !== true) {
    router.push("/installer");
    onRouteChange("installer", "");
}

export { App, i18n, router, configFile, logFile, javaHome, log4js };
