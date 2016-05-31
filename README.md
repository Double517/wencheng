# 文成公主
一个微信公众号全栈工程, 是我的毕业设计
<p align="center" >
  <img src="https://raw.github.com/wujichao/wencheng/master/screenshots/cat.jpg" alt="cat" title="cat">
</p>
>文成公主是苏大东校区的一只猫


##技术栈
nodejs, koa, reactjs, webpack, mocha, 前后端分离


##开发工具
webstorm, ngrok, chrome, 微信web调试工具


##相关截图
####公众号界面
![微信菜单截图](https://raw.github.com/wujichao/wencheng/master/screenshots/wechat.png)
####业务页面
![业务页截图](https://raw.github.com/wujichao/wencheng/master/screenshots/pages.png)
####脱离微信在浏览器中使用
![手机浏览器截图](https://raw.github.com/wujichao/wencheng/master/screenshots/safari.png)


##架构介绍
![架构图](https://raw.github.com/wujichao/wencheng/master/screenshots/modules.png)

微信的公众号的交互形式有两种，一种是普通的消息会话，还有一种是公众号内网页.  
有部分业务是相同的, 比如课表查询, 既可以在消息会话里查询, 也可以在 web 页面展示, 为了实现代码的公用. 特地抽出业务层, 微信消息会话通过消息解析中间件解析然后交给消息分派中间件调用相应的业务模块处理. 而微信内 web 通过api路由调用相应业务模块.

- 消息解析中间件(消息解析收发模块)是`co-wechat`
- 消息分派中间件(消息自动回复模块)是`/server/wechat_robot.js`
- 业务模块是`/server/api/*.js`
- 路由是`/server/router/*.js`


##微信用户认证流程介绍
用户认证和路由都是在前端做的, 参考[react-router/examples/auth-with-shared-root](https://github.com/reactjs/react-router/tree/master/examples/auth-with-shared-root)实现.  
微信消息的用户认证比较简单, 直接使用 message 里面的 openid 即可.  
而微信内 web 页用户认证比较复杂, 当用户点进去我们的 web 页, 我们怎么知道是哪一个用户点进去的?

- 比较简单的方法是给页面 url 加上一个参数`?openid=123456`, 然后通过 openid 来区分用户. [广科小喵](https://github.com/paicha/gxgk-wechat-server)就是这样做的. 缺点一个是安全性不好, openid 不能泄露. 另一个就是用户点击自定义菜单, 不能直接进入页面, 因为没有 openid 参数啊, 需要返回一个有openid参数的url链接让用户主动点击.

- 标准的做法是利用微信的 OAuth 流程, 先跳转到微信的 OAuth 页, 然后带着一个 code 参数跳转回来, 然后用这个 code 参数值去拿 openid, [文档](http://mp.weixin.qq.com/wiki/4/9ac2e7b1f1d22e9e57260f6553822520.html), 然后用 openid 去用户绑定表拿到 user 信息, 最后存在 session 里. 

我们使用标准的做法, 同时我们还期望这些 web 页脱离微信也可以正常登陆使用. 具体流程如下图.  
![流程图](https://raw.github.com/wujichao/wencheng/master/screenshots/auth_flow.png)


##数据库
现有系统使用 sqlserver, 我们沿用 sqlserver, 使用 [node-mssql](https://github.com/patriksimek/node-mssql) + [Tedious](https://www.npmjs.com/package/tedious) 连接  
同时封装了常用方法, 见`/server/database/index.js`  
后来才发现有现成的 [co-warpper](https://github.com/patriksimek/co-mssql)


##如何部署
理论上没有具体的业务数据库没法正常使用...   
写一下理论上的使用方法吧  
修改 `server/config/config.js`   
修改 `server/config/key.js`  
运行 ngrok `./ngrok -config ngrok.cfg -subdomain wencheng 3000`  
运行 server `nodeman /server/app.js`  
运行 client `cd client; npm start`  


##微信开发相关
###三方库
- [co-wechat](https://github.com/node-webot/co-wechat)
- [co-wechat-api](https://github.com/node-webot/co-wechat-api)
- [co-wechat-oauth](https://github.com/node-webot/co-wechat-oauth)

###Ngrok
[ngrok](https://ngrok.com) 是反向代理, 是微信服务器与本地开发环境的桥梁

###资源
- [微信开发文档](http://mp.weixin.qq.com/wiki/home/index.html)
- [微信开发测试账号](http://mp.weixin.qq.com/debug/cgi-bin/sandbox?t=sandbox/login)
- [微信公众平台接口调试工具](http://mp.weixin.qq.com/debug/)
- [微信web开发者工具](https://mp.weixin.qq.com/wiki/10/e5f772f4521da17fa0d7304f68b97d7e.html)

##学习资源推荐
下面是我学习这些语言框架时, 查找了大量资料, 其中**非常**有帮助的资源.

###前后端分离
- [Web 研发模式演变 - 玉伯](https://github.com/lifesinger/lifesinger.github.com/issues/184)   
- [前后端分离的思考与实践系列](http://blog.jobbole.com/65513/)
- [淘宝前后端分离实践 slide](http://2014.jsconf.cn/slides/herman-taobaoweb/index.html)   

###Node.js:
- [官方文档](https://nodejs.org/api/)
- 深入浅出Node.js - 朴灵

###Koa:
- [官方文档](https://github.com/koajs/koa)
- [Generator, Co and Koa - deadhorse](http://deadhorse.me/co-and-koa-talk/)
- [Koa 框架 - 阮一峰](http://javascript.ruanyifeng.com/nodejs/koa.html)

###ES6

- [es6-features](http://es6-features.org/)
- [ECMAScript 6入门](http://es6.ruanyifeng.com/)
- [React/React Native 的ES5 ES6写法对照表](http://bbs.reactnative.cn/topic/15/react-react-native-%E7%9A%84es5-es6%E5%86%99%E6%B3%95%E5%AF%B9%E7%85%A7%E8%A1%A8/2)

###React
- [官方文档](https://facebook.github.io/react/docs/getting-started.html)
- [react-patterns](https://github.com/planningcenter/react-patterns)
- [react-howto](https://github.com/petehunt/react-howto)
- [props vs state](https://github.com/uberVU/react-guide/blob/master/props-vs-state.md)
- [React Router 使用教程](http://www.ruanyifeng.com/blog/2016/05/react_router.html)