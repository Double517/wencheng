// 3st
const Router = require('koa-router');

// 1st
const db = require('../database');
const apiError = require('../api/error');
const api = require('../api');

// router
const router = new Router({
    prefix: '/api/wechat'
});

// exports
module.exports = router;

// wechat
//
router.post('/bind', api.wechat.bind);
router.post('/unbind', api.wechat.unbind);
router.post('/getJsConfig', api.wechat.getJsConfig);
router.post('/getUser', api.wechat.getUser);