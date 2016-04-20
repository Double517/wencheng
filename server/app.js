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
const messages = require('./controllers/messages');
const db = require('./database');

// wechat
const wechat = require('co-wechat');
const WechatAPI = require('co-wechat-api');
const wechat_api = new WechatAPI(keys.WECHAT_APPID, keys.WECHAT_APPSECRET);
const wechat_robot = require('./wechat').robot;
const wechat_web_auth = require('./wechat/web-auth');


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
        yield next;
    }
});

app.use(wechat_web_auth);

// route
router.get('/', messages.home);
router.get('/messages', messages.list);
router.get('/messages/:id', messages.fetch);
router.post('/messages', messages.create);
router.get('/async', messages.delay);
router.get('/promise', messages.promise);

const render = require(('co-views'))(__dirname + '/views', {
    map: { html: 'swig' }
});

router.get('/bind', function *() {
    // this.body = this;
    // console.log(this.openid);
    const param = {
        debug: true,
        jsApiList: ['closeWindow'],
        url: this.request.href
    };
    const jsconfig = yield wechat_api.getJsConfig(param);
    console.log(jsconfig);
    this.body = yield render('bind', {jsconfig: JSON.stringify(jsconfig)});
});

router.get('/db', function *() {
    var a = yield db.query('select * from UserRoles');
    this.body = a;
});

router.post('/api/bind', function *() {
    const userid = this.request.body.username;
    const password = this.request.body.password;
    const openid = this.openid;

    assert(userid && password && openid);

    //1 账号密码 校验
    //2 服务端获取openid
    //3 是否已绑过
    //4 存进去数据库
    //5 返回成功

    const request = yield db.request();
    request.input('userId', userid);
    request.input('pwd', password);
    const r = yield request.execute('Web用户登录判断');

    const userType = r.returnValue;
    if (userType === constants.USER_TYPE_STUDENT ||
        userType === constants.USER_TYPE_TEACHER ||
        userType === constants.USER_TYPE_HEAD_TEACHER) {

        const request1 = yield db.request();
        request1.input('openid', openid);
        const r1 = yield request1.queryOne('select userid from wechat_bind where openid=@openid');
        if (r1) {
            this.body = {code: -1, msg: JSON.stringify(r1)};
            return;
        }

        if (r1 !== null) {
            this.body = {code:-1, msg:'exist account'};
        }

        const request2 = yield db.request();
        request2.input('openid', openid);
        request2.input('userid', userid);
        request2.input('usertype', userType);
        const r2 = yield request2.query('insert into wechat_bind values (@openid,@userid,@usertype)');

        assert(r2 === undefined);

        this.body = {code:0, msg:'success'};
    } else {
        this.body = {code:-1, msg:'password error'};
    }
});

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
        console.log('#### error #### \n%s', err.message);
        console.log(err);
        console.log(ctx);
        console.log('#### end ####');
    }
});

if (!module.parent) {
  app.listen(3000);
  console.log('listening on port 3000');
}