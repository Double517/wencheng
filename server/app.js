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

// 注入openid 和 userid
app.use(wechat_web_auth);

app.use(function *(next) {
    // TODO: for test
    if (this.query.userid) {
        this.userid = this.query.userid;
    }

    // 临时放在这, 之后把绑定, 登录的放在router之前
    if (this.path === '/bind' ||
        this.path === '/api/bind') {
        return yield *next;
    }

    if (!this.userid) {
        this.body = api.return(apiError.unauthorized);
        return;
    }

    return yield *next;
});

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
router.get('/student/class_schedule', function *(next) {
    const schedule = yield api.student.get_this_week_class_schedule(this.userid);
    this.body = api.return(schedule);
});
router.get('/student/score/all', function *(next) {
    const all = yield api.student.get_score(this.userid);
    this.body = api.returnList(all);
});
router.get('/student/score/cet', function *(next) {
    const all = yield api.student.get_score_cet(this.userid);
    this.body = api.returnList(all);
});
router.get('/student/exam/schedule', function *(next) {
    const schedule = yield api.student.get_exam_schedule(this.userid);
    this.body = api.returnList(schedule);
});
router.get('/student/rewards', function *(next) {
    this.body = api.success();
});
router.get('/student/behavior', function *(next) {
    this.body = api.success();
});

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