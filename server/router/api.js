// 3st
const Router = require('koa-router');

// 1st
const db = require('../database');
const apiError = require('../api/error');
const api = require('../api');

// router
const router = new Router({
    prefix: '/api'
});
module.exports = router;

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
// TODO: 这两个接口统一成 {code, msg, data}的格式
router.post('/bind', api.wechat.bind);
router.post('/getJsConfig', api.wechat.getJsConfig);

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
    const all = yield api.student.get_rewards(this.userid);
    this.body = api.returnList(all);
});
router.get('/student/punishment', function *(next) {
    const all = yield api.student.get_punishment(this.userid);
    this.body = api.returnList(all);
});
router.get('/student/behavior', function *(next) {
    const result = yield api.student.get_behavior(this.userid);
    this.body = api.return(result);
});