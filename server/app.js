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

// config
const keys = require('./config/keys');
const config = require('./config/config.js');

// 1st
const messages = require('./controllers/messages');
const db = require('./database');

// wechat
const wechat = require('co-wechat');
const WechatAPI = require('co-wechat-api');
const wechat_api = new WechatAPI(keys.WECHAT_APPID, keys.WECHAT_APPSECRET);
const wechat_robot = require('./wechat').robot;


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

// router
app.use(router.routes());
app.use(router.allowedMethods());

// Serve static files
app.use(serve(path.join(__dirname, 'public')));

// wechat
app.use(function *(next){
    if (this.path.indexOf('/wechat/') !== -1) {
        yield wechat(keys.WECHAT_TOKEN).middleware(wechat_robot);
    } else {
        yield next;
    }
});

// route
router.get('/', messages.home);
router.get('/messages', messages.list);
router.get('/messages/:id', messages.fetch);
router.post('/messages', messages.create);
router.get('/async', messages.delay);
router.get('/promise', messages.promise);

router.get('/db', function *() {
    var a = yield db.thunk();
    this.body = a;
});

// Compress
// compress 以后研究 先去掉
// app.use(compress());


// error handler
app.on('error', function(err, ctx){
    console.log('111');
    if (config.NODE_ENV !== 'test') {
        // TODO: log to file
        console.log('sent error %s to the cloud', err.message);
        console.log(err);
        console.log(ctx);
    }
});

// db.test();
//db.test2();

if (!module.parent) {
  app.listen(3000);
  console.log('listening on port 3000');
}