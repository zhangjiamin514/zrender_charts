const path = require("path");

const webpack = require('webpack');
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HappyPack = require('happypack');
const os = require('os');
const happyThreadPool = HappyPack.ThreadPool({size: os.cpus().length});

const pathVars = require("./pathVars");
const pageVars = require("./pageVars");
const packageJson = require("./../package.json");

const config = {};


//---------------------------------- entry -----------------------------------//
const entryBase = {
    /*第三方库*/
    vendor: Object.keys(packageJson.dependencies)
};

pageVars.forEach(function (page) {
    entryBase[page["chunkName"]] = page["entryJs"];
});

config["entryBase"] = entryBase;


//---------------------------------- output -----------------------------------//

let outputBase = {
    path: pathVars.distPath,
    publicPath: "./",     // 表示资源的发布地址，当配置过该属性后，打包文件中所有通过相对路径引用的资源都会被配置的路径所替换(如：css中背景图的路径)
    filename: "[name]/index_[hash].js"
    //chunkFilename: '[name]/index_[hash].chunk.js'
};
config["outputBase"] = outputBase;


//---------------------------------- devServer -----------------------------------//
let devServer = {
    publicPath: "/",
    contentBase: pathVars.devPath,
    hot: true,
    inline: true,
    port: 3001,
    host: 'localhost',
    proxy: {//跨域代理，匹配/login转换访问域名http://223.71.68.17:8180/login
      '/login': {
        target: 'http://223.71.68.17:8180',
        pathRewrite: { '^/login': '/login' },
        changeOrigin: true
      },
      '/data': {
        target: 'http://223.71.68.17:8180',
        pathRewrite: { '^/data': '/data' },
        changeOrigin: true
      }
    }
};
config["devServer"] = devServer;

let resolve = {
    alias: {
        /* eslint-disable*/
        commonDir: path.resolve(__dirname, '../src/common/'),
        assetsDir: path.resolve(__dirname, '../src/assets/')
        /* eslint-enable*/
    }
};
config["resolve"] = resolve;


//---------------------------------- module -----------------------------------//
let moduleBase = {
    rules: [
        {
            test: /\.(htm|html)$/i,
            loader: 'html-withimg-loader'
        },
        {
            test: /\.(css|less)$/,
            include: [pathVars.srcPath],
            exclude: [pathVars.nodeModulesPath],
            use: [
                {
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        /* 解决css背景图路径问题 由于图片目录已经定好了，因此这里可以用固定的相对路径*/
                        publicPath: '../'
                    },
                },
                //"css-loader?modules&localIdentName=[name]__[local]-[hash:base64:5]",
                "css-loader",
                "less-loader"
            ],
        },
        {
            test: /\.js$/,
            exclude: pathVars.nodeModulesPath,
            include: pathVars.srcPath,
            //use: ['babel-loader'],
            use: ["happypack/loader?id=babel"]
        },
        {
            test: /\.(png|jpg|gif|woff|svg|eot|ttf|woff2)$/,
            use: ["url-loader?limit=5000&name=chart3/[name]_[hash:5].[ext]"]
            //利用HappyPack打包，图片会损坏。暂时不使用
            //use: ["happypack/loader?id=url"]
        },
        {
            test: /\.glsl$/,
            use: 'webpack-glsl-loader'
        }
    ]
};
config["moduleBase"] = moduleBase;


//---------------------------------- plugin -----------------------------------//
let pluginBase = [
    new webpack.DllReferencePlugin({
        context: pathVars.rootPath,
        manifest: require(pathVars.dllPath + '/manifest.json')
    }),
    new MiniCssExtractPlugin({
        filename: "[name]/index_[hash:5].css",
    }),
    new HappyPack({
        id: 'babel',
        loaders: ["babel-loader"],
        threadPool: happyThreadPool
    }),
    /*new HappyPack({
        id: 'url',
        loaders: ["url-loader?limit=5000&name=chart3/[name]_[hash:5].[ext]"],
        threadPool: happyThreadPool
    })*/
    new CopyWebpackPlugin([{
        from: pathVars.staticPath,
        //to 起始位置为发布目录
        to: "static"
    }]),
];

pageVars.forEach(function (page) {
    let htmlPlugin = new HtmlWebpackPlugin({
        title: 'dataOne',
        template: page["filePath"],
        filename: page["htmlName"],
        inject: 'body',
        chunks: ["manifest", "vendor", "common", page["chunkName"]],
        chunksSortMode: 'dependency'
    });
    pluginBase.push(htmlPlugin);
});


//------------------- dev
let pluginDev = [
    new webpack.HotModuleReplacementPlugin()
];
config["pluginDev"] = pluginBase.concat(pluginDev);


//------------------- dist
let pluginDist = [
    new CleanWebpackPlugin(
        {
            cleanOnceBeforeBuildPatterns: [pathVars.distPath + '/*'],
        }
    ),
    new webpack.NoEmitOnErrorsPlugin(),
];
config["pluginDist"] = pluginBase.concat(pluginDist);



//----------------------------------- optimization  ---------------------------//
config["optimizationDev"] = {
    minimize: false,
    splitChunks: {
        chunks: "all", //initial
        minSize: 30 * 1024, //模块大于30k会被抽离到公共模块 也就是说每个页面的js不会大于30k
        minChunks: 1, //模块出现1次就会被抽离到公共模块
        maxAsyncRequests: 5, //异步模块，一次最多只能被加载5个
        maxInitialRequests: 3, //入口模块最多只能加载3个
        name: true,
        cacheGroups: {
            default: {
                chunks: "all",
                name: "common",
                test: /[\\/]src[\\/]/,
                minChunks: 3, /*模块中出现至少3次才会抽出，因此示例中有可能不会抽出此模块*/
                priority: -20,
                reuseExistingChunk: true
            },
            vendor: {
                chunks: "all",
                name: "vendor",
                test: /[\\/]node_modules[\\/]/,
                minChunks: 1,
                priority: -10
            }
        }
    },
    runtimeChunk: {
        name: "manifest"
    }
};
//
config["optimizationDist"] = {
    minimize: true,          //压缩
    minimizer: [
        new UglifyJsPlugin({
            cache: true,
            parallel: true,
            uglifyOptions: {
                compress: {
                    warnings: false,
                    drop_debugger: true,
                    drop_console: false
                },
                mangle:false      //不混淆
            }
        }),
        new OptimizeCssAssetsPlugin({})
    ],
    splitChunks: {
        chunks: "all", //initial
        minSize: 30 * 1024, //模块大于30k会被抽离到公共模块 也就是说每个页面的js不会大于30k
        minChunks: 1, //模块出现1次就会被抽离到公共模块
        maxAsyncRequests: 5, //异步模块，一次最多只能被加载5个
        maxInitialRequests: 3, //入口模块最多只能加载3个
        name: true,
        cacheGroups: {
            default: {
                chunks: "all",
                name: "common",
                test: /[\\/]src[\\/]/,
                minChunks: 3,
                priority: -20,
                reuseExistingChunk: true
            },
            vendor: {
                chunks: "all",
                name: "vendor",
                test: /[\\/]node_modules[\\/]/,
                minChunks: 1,
                priority: -10
            }
        }
    },
    runtimeChunk: {
        name: "manifest"
    }
};


module.exports = config;