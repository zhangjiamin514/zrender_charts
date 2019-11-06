/*
 * 用来预编译第三方库*/

const webpack = require('webpack');
const pathVars = require('./pathVars');
const packageJson = require("./../package.json");

//
module.exports = {
    mode: 'development',
    entry: {
        /*第三方库*/
        dll:  Object.keys(packageJson.dependencies)
    },
    output: {
        path: pathVars.dllPath,
        filename: "[name].js",
        library: '[name]',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    plugins: [
        new webpack.DllPlugin({
            // path 定义 manifest 文件生成的位置 [name]的部分由entry的名字替换
            path: pathVars.dllPath + '/manifest.json',
            // name 是dll暴露的对象名，要跟 output.library 保持一致
            name: '[name]',
            // context 是解析包路径的上下文，这个要跟接下来配置的dll一致
            context: pathVars.dllPath
        })
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: pathVars.nodeModulesPath,
                use: ["babel-loader"]
            }
        ]
    }
};
