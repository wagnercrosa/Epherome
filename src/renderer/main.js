"use strict";

import Vue from "vue";
import VueRouter from "vue-router";
import VueI18n from "vue-i18n";
import App from "@/App";
import vuetify from "@/plugins/vuetify";
import { log4js } from "@/renderer/utils";
import { readProperty } from "@/renderer/property";
import { ipcRenderer } from "electron";
import "material-design-icons-iconfont/dist/material-design-icons.css";
import "typeface-roboto/index.css";
import "animate.css/animate.min.css";
import path from "path";
import { onRouteChange } from "./route";

let configFile = "";
let javaHome = "";
ipcRenderer.on("get-basic-vars", (_ev, args) => {
    configFile = args[0] + path.sep + "config.json";
    javaHome = args[1];
});

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

export { App, i18n, router, configFile, javaHome };
