let config = require("./config");
module.exports = {
    mode: 'development',
    entry: config["entryBase"],
    output: config["outputBase"],
    resolve: config["resolve"],
    devtool: 'eval-source-map',
    devServer: config["devServer"],
    plugins: config["pluginDev"],
    module: config["moduleBase"],
    optimization: config["optimizationDev"]
};
