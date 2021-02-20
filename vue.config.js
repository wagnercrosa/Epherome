module.exports = {
    pluginOptions: {
        electronBuilder: {
            nodeIntegration: true,
            builderOptions: {
                productName: "Epherome",
                copyright: "Copyright © 2021 ResetPower. All rights reserved.",
                appId: "com.epherome",
                asar: true,
                compression: "maximum",
                directories: {
                    output: "package",
                },
                mac: {},
                linux: {},
                win: {
                    target: [
                        {
                            target: "portable",
                            arch: ["x64", "ia32"],
                        },
                    ],
                },
            },
        },
    },
    devServer: {
        disableHostCheck: true,
    },
    configureWebpack: {
        devtool: "source-map",
        entry: "./src/renderer/main.js",
    },
    transpileDependencies: ["vuetify"],
};
