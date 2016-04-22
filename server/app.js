"use strict"
// 3st
const compress = require('koa-compress');
const logger = require('koa-logger');
const serve = require('koa-static');
const koa = require('koa');
const path = require('path');
const app = module.exports = koa();
const router = require('koa-router')();
const onerror = require('koa-onerror');
const json = require('koa-json');
const session = require('koa-generic-session');
const SQLite3Store = require('koa-sqlite3-session');
const bodyParser = require('koa-bodyparser');
const assert = require('chai').assert;

// config
const keys = require('./config/keys');
const config = require('./config/config.js');

// 1st
const constants = require('./constants');
const db = require('./database');
const apiError = require('./api/error');
const api = require('./api');

// wechat
const wechat = require('co-wechat');
const wechat_robot = require('./wechat').robot;
const wechat_web_auth = require('./wechat/web-auth');


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

// Serve static files
app.use(serve(path.join(__dirname, 'public')));

// wechat
app.use(function *(next) {
    if (this.path.indexOf('/wechat/') !== -1) {
        yield wechat(keys.WECHAT_TOKEN).middleware(wechat_robot);
    } else {
        yield *next;
    }
});

app.use(wechat_web_auth);

// routers
// example
//
router.get('/', api.example.home);
router.get('/messages', api.example.list);
router.get('/messages/:id', api.example.fetch);
router.post('/messages', api.example.create);
router.get('/async', api.example.delay);
router.get('/promise', api.example.promise);
router.get('/db', function *() {
    var a = yield db.query('select * from UserRoles');
    this.body = a;
});

// wechat
//
router.post('/api/bind', api.wechat.bind);

// teacher
//

// student
//

// 临时的页面
//
router.get('/bind', api.page.bind);

// router
app.use(router.routes());
app.use(router.allowedMethods());

// Compress
// compress 以后研究 先去掉
// app.use(compress());

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