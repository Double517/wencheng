"use strict"
const messages = require('./controllers/messages');
const compress = require('koa-compress');
const logger = require('koa-logger');
const serve = require('koa-static');
const koa = require('koa');
const path = require('path');
const app = module.exports = koa();
const router = require('koa-router')();
const onerror = require('koa-onerror');

const db = require('./database');

const session = require('koa-generic-session');
const SQLite3Store = require('koa-sqlite3-session');
const wechat = require('co-wechat');
const WechatAPI = require('co-wechat-api');
const wechat_token = 'hehe';
const wechat_api = new WechatAPI('wx42bdab9ae9ef4ee4', '965fc0fe3f8db1170777d4f4adcef890');
const wechat_robot = require('./wechat').robot;

// onerror
onerror(app);

// Logger
app.use(logger());

// session
// app.use(session());
app.use(session({
    store: new SQLite3Store('session_db_file/session.db', {/*default options*/})
}));


// router
app.use(router.routes());
app.use(router.allowedMethods());

// route
router.get('/', messages.home);
router.get('/messages', messages.list);
router.get('/messages/:id', messages.fetch);
router.post('/messages', messages.create);
router.get('/async', messages.delay);
router.get('/promise', messages.promise);

// wechat
app.use(function *(next){
    if (this.path.indexOf('/wechat/') !== -1) {
        yield wechat(wechat_token).middleware(wechat_robot);
    } else {
        yield next;
    }
});

router.get('/db', function *() {
    var a = yield db.thunk();
    this.body = a;
});

// Serve static files
app.use(serve(path.join(__dirname, 'public')));

// Compress
// compress 以后研究 先去掉
// app.use(compress());

// db.test();
//db.test2();

if (!module.parent) {
  app.listen(3000);
  console.log('listening on port 3000');
}