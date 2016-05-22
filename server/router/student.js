// 3st
const Router = require('koa-router');

// 1st
const db = require('../database');
const apiError = require('../api/error');
const api = require('../api');
const constants = require('../constants');

// router
const router = new Router({
    prefix: '/api/student'
});

// exports
module.exports = router;

// auth
function *checkPermission(next) {
    const user = this.session.user;
    console.log(user);
    if (user && user.usertype === constants.USER_TYPE_STUDENT) {
        this.userid = user.userid;
        yield *next;
    } else if (user && user.usertype === constants.USER_TYPE_HEAD_TEACHER) {
        this.userid = '1417433001'; //TODO get student_id from query
        yield *next;
    } else {
        this.body = api.return(apiError.unauthorized);
    }
}

//
//
router.get('/class_schedule', checkPermission, function *(next) {
    const schedule = yield api.student.get_this_week_class_schedule(this.userid);
    this.body = api.return(schedule);
});
router.get('/score/all', checkPermission, function *(next) {
    const all = yield api.student.get_score(this.userid);
    this.body = api.returnList(all);
});
router.get('/score/cet', checkPermission, function *(next) {
    const all = yield api.student.get_score_cet(this.userid);
    this.body = api.returnList(all);
});
router.get('/exam/schedule', checkPermission, function *(next) {
    const schedule = yield api.student.get_exam_schedule(this.userid);
    this.body = api.returnList(schedule);
});
router.get('/rewards', checkPermission, function *(next) {
    const all = yield api.student.get_rewards(this.userid);
    this.body = api.returnList(all);
});
router.get('/punishment', checkPermission, function *(next) {
    const all = yield api.student.get_punishment(this.userid);
    this.body = api.returnList(all);
});
router.get('/behavior', checkPermission, function *(next) {
    const result = yield api.student.get_behavior(this.userid);
    this.body = api.return(result);
});

