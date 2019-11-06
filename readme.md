# 欢迎使用 zrender_charts 环境

------

先克隆，安装，然后编译，测试，发布：

> * git clone zrender_charts
> * cd zrender_charts
> * npm install
> * npm run dll
> * npm run dev    **//运行**
> * npm run dist   **//发布**

------

## 开发模式页面访问

运行 npm run dev 后，打开http://localhost:3001/{页面名}.html 页面名为 src/pages/ 下不同页面文件夹的名字 如：http://localhost:3001/multiDemo.html

### **文件存放说明**

├── assets // 统一存放图片
│   ├──page1 // 该页面所需要的所有图片（组件需要的图片除外）
│   └──page2
├── common // 存放公用的文件
├── pages // 所有页面存在此目录下
│   └── chartMore // 示例页面
│      ├── chart // 存放组件的文件夹
│      │   ├── chart.js // 单个组件对应的文件
│      ├── index.html
│      ├── index.js
│      └── index.less
└── unit // 所有的公共模块文档存在此目录下
    └── animateChoose.js // 动画js
    └── legend.js // 图例js
    └── numberA.js // 数字动效js
    └── Tooltip.js // 提示框js
    └── TweenMax.min.js // TweenMax.min.js
    └── X_Axis.js // x轴js
    └── Y_Axis.js // y轴js


### **组件创建**
创建组件可以先把公共的模块引入，比如x轴，y轴，只需要往里面传入参数，就可以配置好，其他的同理。
如果公共的模块不满足需求，可以自己单独写一个，放到同级目录中，不要放到公共的里面。

