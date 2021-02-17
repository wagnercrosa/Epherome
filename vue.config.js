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
                linux: {
                    target: "AppImage",
                },
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
    },
    transpileDependencies: ["vuetify"],
    configureWebpack: {
        entry: "./src/renderer/main.js",
    },
};
