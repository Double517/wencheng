// 3st
const Router = require('koa-router');

// 1st
const db = require('../database');
const apiError = require('../api/error');
const api = require('../api');

// router
const router = new Router({
    prefix: '/api/log'
});

// exports
module.exports = router;

//
//
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