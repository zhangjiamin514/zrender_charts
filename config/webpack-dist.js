const config = require("./config");
module.exports = {
    mode: 'production',
    entry: config["entryBase"],
    output: config["outputBase"],
    resolve: config["resolve"],
    module: config["moduleBase"],
    plugins: config["pluginDist"],
    optimization:config["optimizationDist"]
};