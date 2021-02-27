<template>
    <v-app>
        <v-app-bar color="primary white--text" style="-webkit-app-region: drag;" dense app>
            <v-btn
                v-on:click="backPage"
                color="white"
                style="-webkit-app-region: no-drag; margin-left: 1px; margin-bottom: 0px;"
                small
                icon
            >
                <v-icon id="app-bar-left-icon">home</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <v-toolbar-title style="cursor: default;" id="app-title">Epherome</v-toolbar-title>
            <v-spacer></v-spacer>
        </v-app-bar>
        <v-main>
            <transition name="fade" mode="out-in">
                <router-view></router-view>
            </transition>
        </v-main>
    </v-app>
</template>

<script>
import { backPage, togglePage } from "@/renderer/route";
import { e } from "@/renderer/utils";

export default {
    name: "App",
    methods: {
        updateTitle(title) {
            let appBarLeftIcon = e("app-bar-left-icon");
            let appTitle = e("app-title");
            appTitle.innerText = title;
            if (title === "Epherome") {
                appBarLeftIcon.innerText = "home";
            } else {
                appBarLeftIcon.innerText = "arrow_back";
            }
        },
        updateIcon(icon) {
            e("app-bar-left-icon").innerText = icon;
        },
        backPage() {
            let appBarLeftIcon = e("app-bar-left-icon");
            if (appBarLeftIcon.innerText === "arrow_back") {
                backPage();
            }
        },
        togglePage(name) {
            togglePage(name);
        },
    },
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s;
}
.fade-enter,
.fade-leave-to {
    opacity: 0;
}
body::-webkit-scrollbar {
    width: 0 !important;
}
.eph-btn-active {
    background-color: rgba(0, 0, 0, 0.2);
}
</style>
