const db = require('../database');
const moment = require('moment');
const _ = require('lodash');
const util = require('../api/util');


/*
参数1 string userid: 学号
参数2 int week: 周 [1,18]
输出 array
 kcmc 课程名称
 skxq 星期
 qsjc 起始节
 jsjc 结束节
 zxz 0所有周 1单周 2双周
 ksz 开始周 不需要
 jsz 结束周 不要要
 jsdm 编号
 */
const get_class_schedule =
module.exports.get_class_schedule = function *(userid, week)
{
    const term_result = yield db.queryOne('select dqxq from systemconfig');

    const request = yield db.request();
    request.input('xqbs', term_result.dqxq); //当前学期
    request.input('xh', userid); //学号
    request.input('zc', week); //当前周
    const result = yield request.execute('web_xs_coursetable');

    console.log(result);

    return {week: week, list: result[0]};
};

const get_this_week_class_schedule =
module.exports.get_this_week_class_schedule = function *(userid)
{
    console.log(userid);

    // 获取起始周
    const start_data = yield db.queryOne('select dqxqqszdate from webglbasicdata');
    // 计算当前周
    const current_week = util.get_current_week(start_data.dqxqqszdate);

    return yield get_class_schedule(userid, current_week);
};

module.exports.get_today_class_schedule = function *(userid)
{
    const result = yield get_this_week_class_schedule(userid);
    const day = moment().day();

    var r = [];
    _(result.list).forEach(function(item) {
        if (item.skxq == day) {
            r.push(item);
        }
    });
    return {day: day, list: r};
};