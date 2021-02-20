<template>
    <v-stepper v-model="step">
        <v-stepper-header>
            <v-stepper-step :complete="step > 1" step="1"> </v-stepper-step>
            <v-stepper-step :complete="step > 2" step="2"> </v-stepper-step>
            <v-stepper-step step="3"> </v-stepper-step>
        </v-stepper-header>

        <v-stepper-items>
            <v-stepper-content step="1">
                <h3>{{ $t("text.choose-lang") }}</h3>
                <p>{{ $t("text.edit-in-settings") }}</p>
                <v-list>
                    <v-list-item-group
                        v-model="selectedLanguage"
                        v-on:change="onLanguageChange"
                        color="primary"
                        mandatory
                    >
                        <v-list-item>
                            <v-list-item-icon>
                                <img src="@/assets/svg/prc.svg" width="50" />
                            </v-list-item-icon>
                            <v-list-item-content>
                                <v-list-item-title>中文简体</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item>
                            <v-list-item-icon>
                                <img src="@/assets/svg/usa.svg" width="50" />
                            </v-list-item-icon>
                            <v-list-item-content>
                                <v-list-item-title>English</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item>
                            <v-list-item-icon>
                                <img src="@/assets/svg/japan.svg" width="50" />
                            </v-list-item-icon>
                            <v-list-item-content>
                                <v-list-item-title>日本語</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list-item-group>
                </v-list>
                <div style="float: right;">
                    <v-btn color="primary" v-on:click="step = 2" depressed>
                        {{ $t("next") }}
                    </v-btn>
                </div>
            </v-stepper-content>

            <v-stepper-content step="2">
                <h3>{{ $t("configure-java") }}</h3>
                <span v-if="isFoundJavapath">{{ $t("text.found-java-in-ur-env") }}</span>
                <span v-else>{{ $t("text.did-u-install-java") }}</span>
                <v-text-field
                    v-model="inputedJavapath"
                    prepend-icon="local_cafe"
                    :label="$t('java-path')"
                ></v-text-field>
                <div style="float: right;">
                    <v-btn
                        color="secondary"
                        v-on:click="step = 1"
                        style="margin-right: 10px;"
                        depressed
                    >
                        {{ $t("previous") }}
                    </v-btn>
                    <v-btn
                        color="primary"
                        v-on:click="
                            step = 3;
                            onSaveJavapath();
                        "
                        depressed
                    >
                        {{ $t("next") }}
                    </v-btn>
                </div>
            </v-stepper-content>

            <v-stepper-content step="3">
                <h3>{{ $t("congratulations") }}</h3>
                <p>{{ $t("text.initialize-done") }}</p>
                <div style="float: right;">
                    <v-btn
                        color="secondary"
                        v-on:click="step = 2"
                        style="margin-right: 10px;"
                        depressed
                    >
                        {{ $t("previous") }}
                    </v-btn>
                    <v-btn color="primary" v-on:click="onDone" depressed>
                        {{ $t("done") }}
                    </v-btn>
                </div>
            </v-stepper-content>
        </v-stepper-items>
    </v-stepper>
</template>

<script>
import { readProperty, writeProperty } from "@/renderer/property";
import { i18n } from "@/renderer/main";
import { onRouteChange } from "@/renderer/route";
import { javaHome } from "@/renderer/main";
import { backPage } from "../renderer/route";

export default {
    name: "Installer",
    data() {
        return {
            step: 1,
            selectedLanguage: 0,
            inputedJavapath: typeof javaHome === "undefined" ? "java" : javaHome,
            isFoundJavapath: typeof javaHome !== "undefined",
        };
    },
    mounted() {
        let currentLang = readProperty("language");
        this.selectedLanguage = this.languageLocaleToIndex(currentLang);
    },
    methods: {
        languageIndexToLocale(i) {
            return i === 0 ? "zh-cn" : i === 2 ? "ja-jp" : "en-us";
        },
        languageLocaleToIndex(l) {
            return l === "zh-cn" ? 0 : l === "ja-jp" ? 2 : 1;
        },
        onLanguageChange() {
            let lang = this.languageIndexToLocale(this.selectedLanguage);
            i18n.locale = lang;
            onRouteChange("installer", "");
            writeProperty("language", lang);
        },
        onSaveJavapath() {
            writeProperty("java-path", this.inputedJavapath);
        },
        onDone() {
            writeProperty("installed", true);
            backPage();
        },
    },
};
</script>
