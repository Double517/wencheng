// 3st
const Router = require('koa-router');

// 1st
const db = require('../database');
const apiError = require('../api/error');
const api = require('../api');
const constants = require('../constants');

// router
const router = new Router({
    prefix: '/api'
});

// exports
module.exports = router;



// js error
router.get('/reportJsError', function *(next) {
    try {
        var info = JSON.parse(this.query.info);
        console.log(info);
        this.body = '';
    } catch (e) {
        console.log(this.query.info);
        this.body = '';
    }
});

// login
router.post('/login', function *(next) {

    const userid = this.request.body.username;
    const password = this.request.body.password;

    console.log({userid, password});

    if (!userid || !password) {
        this.body = api.return(apiError.parameter_invalid);
        return;
    }

    const request = yield db.request();
    request.input('userId', userid);
    request.input('pwd', password);
    const r = yield request.execute('Web用户登录判断');

    const userType = r.returnValue;
    if (userType === constants.USER_TYPE_STUDENT ||
        userType === constants.USER_TYPE_TEACHER ||
        userType === constants.USER_TYPE_HEAD_TEACHER) {

        // session
        const user = {userid: userid, usertype: userType};
        this.session.user = user;
console.log(user);
        this.body = api.return(user);
    } else {
        this.body = api.return(apiError.password_error);
    }
});

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