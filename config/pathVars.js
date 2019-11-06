const path = require('path');
const pathVars = {};

//项目根目录
/* eslint-disable*/
pathVars.rootPath = path.resolve(__dirname, '../');
/* eslint-enable*/

//源文件目录
pathVars.srcPath = path.resolve(pathVars.rootPath, './src');

//预编译文件存放目录
pathVars.dllPath = path.resolve(pathVars.rootPath, './dll');

//开发测试目录
pathVars.devPath = path.resolve(pathVars.rootPath, './src');

//发布目录
pathVars.distPath = path.resolve(pathVars.rootPath, './dist');

//node_modules目录
pathVars.nodeModulesPath = path.resolve(pathVars.rootPath, './node_modules');

//页面目录
pathVars.pagesPath = path.resolve(pathVars.rootPath, './src/pages');

//静态资源目录
pathVars.staticPath = path.resolve(pathVars.rootPath, './src/static');

module.exports = pathVars;