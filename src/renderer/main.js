"use strict";

import Vue from "vue";
import VueRouter from "vue-router";
import VueI18n from "vue-i18n";
import App from "@/App.vue";
import vuetify from "@/plugins/vuetify";
import Home from "@/components/Home";
import { log4js } from "@/renderer/utils";
import { readProperty } from "@/renderer/property";
import { ipcRenderer } from "electron";
import "material-design-icons-iconfont/dist/material-design-icons.css";
import "typeface-roboto/index.css";
import "animate.css/animate.min.css";
import i18nMap from "@/assets/language.json";
import path from "path";

let configFile = "";

ipcRenderer.on("get-user-data-path", (ev, args) => {
    configFile = args[0] + path.sep + "config.json";
});

const li = log4js.getLogger("index");

li.info("### Web Page Started to Load ###");

Vue.config.productionTip = false;
Vue.use(VueRouter);
Vue.use(VueI18n);

const router = new VueRouter({
    routes: [
        {
            path: "/",
            component: Home,
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
    messages: i18nMap,
});

new Vue({
    vuetify,
    router,
    i18n,
    render: h => {
        return h(App);
    },
}).$mount("#app");

export { App, i18n, router, configFile };
