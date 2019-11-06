

## 安装及运行

```
#克隆、安装
git clone http://git.cn-wbst.cn/client/CAICT_05.git
cd CAICT_05
npm install
```
```
# 编译第三方库
npm run dll
# 测试
npm run dev
# 发布
npm run dist
```

## 项目结构
```
.
├── config //存放webpack配置文件
│   ├── common.js
│   ├── config.js
│   ├── pageVars.js
│   ├── pathVars.js
│   ├── webpack-dev.js
│   ├── webpack-dist.js
│   └── webpack-dll.js
├── dev
├── dist //发布目录
│   ├── assets
│   │   ├── bg_58b21.jpg
│   │   ├── logo_8af35.png
│   │   ├── t2_01dce.jpg
│   │   └── texture_a4a23.jpg
│   ├── multiDemo
│   │   ├── index.css
│   │   └── index.js
│   ├── multiDemo.html
│   ├── static
│   │   └── config.json
│   ├── threejsDemo
│   │   ├── index.css
│   │   └── index.js
│   ├── threejsDemo.html
│   └── vendor
│       ├── index.css
│       └── index.js
├── dll //预编译目录
│   ├── dll.js
│   └── manifest.json
├── package-lock.json
├── package.json
├── readme.md
└── src //源码目录
    ├── assets
    │   ├── bg.jpg
    │   ├── logo.png
    │   ├── t2.jpg
    │   └── texture.jpg
    ├── common
    │   ├── css
    │   │   └── common.less
    │   ├── js
    │   │   ├── DataTween.js
    │   │   ├── ThreeBase.js
    │   │   ├── ThreeGroupLoader.js
    │   │   ├── WebglUtils.js
    │   │   └── webglBase.js
    │   └── shader
    │       ├── fs.glsl
    │       └── vs.glsl
    ├── pages //所有页面存在此目录下
    │   ├── multiDemo //页面
    │   │   ├── charts
    │   │   │   ├── Chart1.js
    │   │   │   ├── Chart2.js
    │   │   │   └── chart3
    │   │   │       └── Chart3.js
    │   │   ├── index.html
    │   │   ├── index.js
    │   │   └── index.less
    │   └── threejsDemo //页面
    │       ├── ThreeApp.js
    │       ├── index.html
    │       ├── index.js
    │       ├── nav.less
    │       └── test.less
    └── static
        └── config.json

```
源码目录与发布目录的对应关系：项目中有两个页面multiDemo、threejsDemo源文件结构见/src/pages，发布后的结构见／dist。如需修改发布后的结构可配置/config/pageVars.js文件。


## 其他说明：

### 开发模式页面访问
运行 npm run dev 后，打开http://localhost:3001/{页面名}.html
*页面名为 src/pages/ 下不同页面文件夹的名字
如：http://localhost:3001/multiDemo.html*

### 文件存放说明
```
├── assets // 统一存放图片
│   ├──page1 // 该页面所需要的所有图片（组件需要的图片除外）
│   └──page2
├── common // 存放公用的文件
├── pages // 所有页面存在此目录下
│   └── page1 // 页面
│      ├── charts // 存放组件的文件夹
│      │   ├── test1 // 单个组件对应的文件夹
│      │   │   └── Chart1 // 该组件需要的图片
│      │   │   └── Chart1.js // 组件(该组件需要的本地文件也存放在该文件夹下)
│      │   ├── test2
│      │   └── test3
│      ├── index.html
│      ├── index.js
│      └── index.less
└── static // 所有的数据和接口文档存在此目录下
    └── page1 // 该页面所用的所有数据或者接口放置此目录下
       ├── page1.json // 该页面对应的接口文档
       ├── charts1.json // 组件对应的本地测试数据
       └── charts2.json

```

### webpack版本
本项目使用webpack 3.x 。暂时不升级到4.x,等4.x整体稳定后再考虑升级。

### 第三方库
主要第三方库有 zrender threejs gsap echarts 后续可根据具体需要增加

### ESlint
本项目环境已配置ESlint,但暂未加入webpack打包检测中，建议在IDE中配置。

### resolve.alias
尽量少使用"../../../x.js"这种多形式使用引用文件。请使用resolve.alias配置常用目录，使用resolve.alias优点：1.可阅读性强。2.移动文件位置时，无需手动修改其中"import ../../"路径。

### 手动配置发布页面，提高测试及发布产率
本项目支持多页面，且以类似正则的形式来匹配发布页面。let files = glob.sync(pathVars.srcPath + "/pages/*/index.html")。当发布页面较多时，可手动指定发布页，详见/config/pageVars.js文件

### 发布文件是否添加hash
看具体需求，对于已上线，并且后期频繁更新跌代的项目，建议对css、js增加hash以避免缓存。
对于一次性上线，且上线过程种会频繁单独替换某个或某几个文件的情况，建议暂时不要增加hash，等最终发布时再增加hash

### static目录与assets目录
* static 中存放的文件不通过webpack打包，主要用于存放一些静态资源、配置文件（发布后还会改动的信息，如：接口信息、项目配置信息等）。static最终会被复制到发布目录的根目录下，即dist目录下,因此在源码中可这么引用static目录下的文件：./static/xx.jpg,但这样IDE会提示./static/xx.jpg不存在（因为项目根目录与发布目录并不相同），如果你有强迫症，那你可以把static放到项目的根目录下，即与src同级。
* assets 中存放素材文件且会通过webpack打包，如：图片、字体、视频等等。

### 使用CommonsChunkPlugin提取共公部分还是externals提取第三方库？
* CommonsChunkPlugin：图表与页面统一打包时，使用CommonsChunkPlugin较为方便。
* externals：当每个图表单独打包时，externals则显得比较重要，externals主要用来抽离第三方库，如一项目中用到之个图表，且图表可能依懒第三方库（zrender、threejs、gsap）中的一个或多个时，应使用externals。使用externals时，还需要在html页面中手动引入被抽取的第三方库。

本项目使用CommonsChunkPlugin提取共公部分，对于多页应用来说，提取公共部分比较重要，尤其页面较多时。

### 完善与改进
后续使用过程中根据实际需求及碰到的问题来不断改进，使整个协作流程更流畅更方便。

### 优化记录
1. 对资源调用的绝对路径统一改为相对路径，方便发布后的部署。2018-11-20
2. threeBase:为stats增加className，方便对该工具显示隐藏等常规操作。2018-11-20
3. threeBase:增加autoRender、autoResize属性。 2018-11-20
4. 优化webpack配置，直接从package.json中读取第三方库，共公模块中只抽取第三方库。2018-11-28

