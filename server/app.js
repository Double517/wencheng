"use strict"
// 3st
const compress = require('koa-compress');
const logger = require('koa-logger');
const serve = require('koa-static');
const koa = require('koa');
const path = require('path');
const app = module.exports = koa();
const onerror = require('koa-onerror');
const json = require('koa-json');
const session = require('koa-generic-session');
const SQLite3Store = require('koa-sqlite3-session');
const bodyParser = require('koa-bodyparser');
const assert = require('chai').assert;
const proxy = require('koa-proxy');
String.prototype.hasPrefix = function (prefix) {
    return this.lastIndexOf(prefix, 0) === 0;
};

// config
const keys = require('./config/keys');
const config = require('./config/config.js');

// 1st
const constants = require('./constants');
const apiRouters = require('./router/routers');
const apiError = require('./api/error');
const api = require('./api');

// wechat
const wechat = require('co-wechat');
const wechat_robot = require('./wechat_robot').robot;
const wechat_web_auth = require('./wechat_robot/web-auth');


require('debug-trace')({
    always: true,
    dateFormat: 'YY/MM/DD HH:mm:ss',
});
console.format = function(c) {
    return c.date + " [" + c.filename + ":" + c.getLineNumber() + "][" + c.functionName + "]";
};


// onerror
onerror(app);

// Logger
app.use(logger());

// Compress
app.use(compress({
    threshold: 2048, //min:2k
    flush: require('zlib').Z_SYNC_FLUSH
}));

if (config.NODE_ENV === 'development') {
    // proxy for client
    app.use(proxy({
        host: 'http://localhost:8080', //'http://localhost:3001'
        match: /^(?!\/(api|wechat))/
    }));
} else {
    // Serve static files
    app.use(serve(path.join(__dirname, '../client/dist')));
    // 进index.html其他都在cdn上, 没必要缓存
    // 即使缓存了, index.html也不能缓存, 里面有js路径要变化的
    // app.use(serve(path.join(__dirname, '../client/dist'), {
    //     maxage:7 * 24 * 60 * 60 * 1000 /*7 day*/
    // }));
}

// koa-bodyparser: post body parser, for application/json and application/x-www-form-urlencoded.
// the parsed body will store in this.request.body
app.use(bodyParser());

// session
// app.use(session());
app.keys = keys.SECRET_KEYS;
app.use(session({
    store: new SQLite3Store('../db/session.db', {/*default options*/})
}));

// json pretty
if (config.NODE_ENV === 'development') {
    app.use(json());
} else {
    app.use(json({ pretty: false, param: 'pretty' })); //for production
}

// wechat
app.use(function *(next) {
    if (this.path.hasPrefix('/wechat/')) {
        yield wechat(keys.WECHAT_TOKEN).middleware(wechat_robot);
    } else {
        yield *next;
    }
});
//
// routers
apiRouters.forEach(function (router) {
    app.use(router.routes());
    app.use(router.allowedMethods());
});

// error handler
app.on('error', function(err, ctx){
    if (config.NODE_ENV !== 'test') {
        // TODO: log to file
        console.log('#### error ####');
        console.log({message: err.message, code: err.code});
        console.log(err.stack);
        console.log(ctx);
        console.log('#### end ####');
    }
});

if (!module.parent) {
  app.listen(3000);
  console.log('listening on port 3000');
}