<template>
    <v-tabs left vertical>
        <v-tab>
            <v-icon left> list</v-icon>
            {{ $t("general") }}
        </v-tab>
        <v-tab>
            <v-icon left> palette</v-icon>
            {{ $t("appearance") }}
        </v-tab>
        <v-tab>
            <v-icon left> info</v-icon>
            {{ $t("about") }}
        </v-tab>
        <v-tab-item>
            <v-container>
                <v-select
                    v-model="selectedLang"
                    prepend-icon="translate"
                    :label="$t('language')"
                    :items="langs"
                    item-text="text"
                    item-value="locale"
                ></v-select>
                <v-text-field
                    v-model="javaPathContent"
                    prepend-icon="local_cafe"
                    :label="$t('java-path')"
                ></v-text-field>
                <v-btn color="warning" v-on:click="reInit" depressed>{{ $t("reinit") }}</v-btn
                ><br /><br />
                <v-btn
                    color="secondary white--text"
                    v-on:click="backPage"
                    style="margin-right: 5px"
                    depressed
                >
                    {{ $t("cancel") }}
                </v-btn>
                <v-btn color="info white--text" v-on:click="saveAll" depressed>{{
                    $t("save")
                }}</v-btn>
            </v-container>
        </v-tab-item>
        <v-tab-item>
            <v-container>
                <v-select
                    v-model="selectedTitleTheme"
                    prepend-icon="calendar_view_day"
                    :label="$t('title-theme')"
                    :items="titleThemes"
                    item-text="text"
                    item-value="name"
                ></v-select>
                <p>{{ $t("text.restart-required") }}</p>
                <v-btn
                    color="secondary white--text"
                    v-on:click="backPage"
                    style="margin-right: 5px"
                    depressed
                >
                    {{ $t("cancel") }}
                </v-btn>
                <v-btn color="info white--text" v-on:click="saveAppearance" depressed>{{
                    $t("save")
                }}</v-btn>
            </v-container>
        </v-tab-item>
        <v-tab-item>
            <v-container>
                <strong>Epherome: {{ epheromeVersion }} ({{ epheromeStage }})</strong><br /><br />
                <span>Electron: {{ electronVersion }}</span
                ><br />
                <span>Chrome: {{ chromeVersion }}</span
                ><br />
                <span>Node.js: {{ nodeVersion }}</span
                ><br />
                <span>V8: {{ v8Version }}</span
                ><br /><br />
                <span>{{ $t("os") }}: {{ operatingSystem }}</span
                ><br /><br />
                <span>
                    {{ $t("user-data-path") }}: <strong>{{ configFile }}</strong> </span
                ><br /><span>
                    {{ $t("log-path") }}: <strong>{{ logFile }}</strong> </span
                ><br /><br />
                <span>
                    {{ $t("official-site") }}:
                    <a v-on:click="openExternal('https://epherome.com')">
                        https://epherome.com
                    </a> </span
                ><br />
                <span>
                    GitHub:
                    <a v-on:click="openExternal('https://github.com/ResetPower/Epherome')">
                        https://github.com/ResetPower/Epherome
                    </a>
                </span>
                <br />
                <span>Copyright © 2021 ResetPower. All rights reserved.</span><br />
                <span>{{ $t("oss") }} | GNU General Public License 3.0</span><br />
            </v-container>
        </v-tab-item>
    </v-tabs>
</template>

<script>
import { readProperty, writeProperty } from "@/renderer/property";
import { backPage, onRouteChange } from "@/renderer/route";
import Epherome from "@/renderer/epherome";
import { shell } from "electron";
import os from "os";
import { configFile as cf, logFile as lf, i18n, log4js, router } from "@/renderer/main";

const openExternal = shell.openExternal;
const l = log4js.getLogger("default");

export default {
    name: "Accounts",
    data() {
        return {
            epheromeVersion: Epherome.version,
            epheromeStage: this.$t("stage.alpha"),
            electronVersion: process.versions.electron,
            chromeVersion: process.versions.chrome,
            nodeVersion: process.versions.node,
            v8Version: process.versions.v8,
            configFile: cf,
            logFile: lf,
            operatingSystem: `${os.platform()} ${os.arch()} ${os.release()}`,
            langs: [
                {
                    locale: "zh-cn",
                    text: "简体中文",
                },
                {
                    locale: "en-us",
                    text: "English",
                },
                {
                    locale: "ja-jp",
                    text: "日本語",
                },
            ],
            formerLang: readProperty("language"),
            selectedLang: readProperty("language"),
            javaPathContent: readProperty("java-path"),
            selectedTitleTheme: readProperty("title-theme"),
            titleThemes: [
                {
                    name: "eph",
                    text: "Epherome",
                },
                {
                    name: "os",
                    text: "Operating System",
                },
            ],
        };
    },
    methods: {
        backPage() {
            backPage();
        },
        reInit() {
            router.replace("/installer");
            onRouteChange("installer", "");
            onRouteChange();
        },
        openExternal(url) {
            openExternal(url);
        },
        saveAll() {
            l.info("Save general settings triggered, saving");
            writeProperty("java-path", this.javaPathContent);
            l.debug("Java path: " + this.javaPathContent);
            writeProperty("language", this.selectedLang);
            l.debug("Language locale: " + this.selectedLang);
            if (this.formerLang !== this.selectedLang) {
                this.formerLang = this.selectedLang;
                i18n.locale = this.selectedLang;
                onRouteChange("settings", "");
            }
        },
        saveAppearance() {
            l.info("Save appearance settings triggered, saving");
            writeProperty("title-theme", this.selectedTitleTheme);
        },
    },
};
</script>
