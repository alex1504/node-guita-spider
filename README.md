## 聚合吉他谱API

- 基于Node+Koa网络爬虫吉他谱接口，集合[吉他社](http://www.jitashe.org/)、[17吉他网](https://www.17jita.com/)、[虫虫吉他](http://www.ccguitar.cn/)，更多网站等待更新。
- 本API仅仅只是学习研究使用,请勿将以下接口用来商业推广以及其他获利用途，如有版权问题请告知删除

## 接口文档

[http://gt-spider.huzerui.com](http://gt-spider.huzerui.com)

## 主要依赖

- [rollup](https://rollupjs.org/guide/en): JavaScript 模块打包器,可以将小块代码编译成大块复杂的代码
- [Koa](https://koajs.com/): 新一代web框架
- [async](https://github.com/caolan/async): 并发控制
- [cheerio](https://cheerio.js.org/): Nodejs页面解析模块
- [docsify](https://docsify.js.org/): 快速生成文档工具

## 项目目录说明
```
.
|-- assets                           // 静态资源目录
|-- docs                             // docsify文档目录
|   |-- index.html                   // docsify入口
|   |-- README.md                    // 文档markdown
|-- servers                          // Koa服务端目录
|-- spiders                          // 爬虫脚本开发目录
|   |-- data                         // 本地数据文件
|       |-- proxy.json               // 爬虫代理ip地址json数据
|   |-- dist                         // 爬虫脚本输出目录
|       |-- main.js                  // 爬虫脚本入口输出
|   |-- src                          // 爬虫脚本逻辑
|       |-- main.js                  // 入口
|       |-- spider_17jita.js         // 17吉他网站爬虫
|       |-- spider_ccjita            // 虫虫吉他网站爬虫
|       |-- spider_jitashe.js        // 吉他社网站爬虫
|       |-- spider_proxy.js          // 代理IP爬虫
|       |-- test.js                  // 测试函数
|       |-- userAgent.js             // userAgent生成
|-- .gitignore                       // Git提交忽略文件规则
|-- README.md                        // 项目说明
|-- package.json                     // 配置项目相关信息
.
```

## 开发指南

### 安装

```
git clone https://github.com/alex1504/node-guita-spider.git
cd node-guita-spider
npm i
npm i docsify -g
```

### 开发

查看`package.json`有如下命令：
```
// 爬虫脚本开发
"crawler:dev": "rollup ./spiders/src/main.js --o ./spiders/dist/main.js --f cjs --w",
// 爬虫脚本打包（爬虫开发命令会自动监听并打包，此命令可忽略）
"crawler:build": "rollup ./spiders/src/main.js --o ./spiders/dist/main.js --f cjs",
// 开启Koa服务器，端口3000
"server:start": "node ./server/bin/www",
// Koa服务端开发，使用nodemon自动监听并重启
"server:dev": "./node_modules/.bin/nodemon ./server/bin/www",
// 开启docsify服务器，端口4000
"docs": "docsify serve docs --port 4000"
```

指南：
- 开发爬虫脚本： `npm run crawler:dev`，修改`/spiders/src/`下的文件，`/spider/dist/main.js`会自动更新
- 开发服务端： `npm run server:dev`，修改`/server/`下的文件，Koa会自动重载
- 开启docsify服务器： `npm run docs`，浏览器打开`http://locaohost:4000`端口查看接口文档

