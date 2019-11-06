const glob = require("glob");
const pathVars = require("./pathVars");

let files = glob.sync(pathVars.srcPath + "/pages/*/index.html");
//let files = glob.sync(pathVars.srcPath + "/pages/demo02/index.html");

//console.log(files);
let pageAry = [];
files.forEach(function (filePath) {
    //将单个文件路径（/src/pages/news/detail/index.html）路径拆分成数组
    let tempAry = filePath.split('/');
    let chunkName = tempAry[tempAry.length - 2];
    //let htmlName = chunkName + "/index.html";
    let htmlName = chunkName + ".html";
    let entryJs = pathVars.pagesPath + "/" + chunkName + "/index.js";

    let obj = {};
    obj["filePath"] = filePath;
    obj["chunkName"] = chunkName;
    obj["htmlName"] = htmlName;
    obj["entryJs"] = entryJs;
    pageAry.push(obj);
});

module.exports = pageAry;