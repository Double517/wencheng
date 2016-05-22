/**
 * Created by wujichao on 16/4/20.
 */
const config = require('../config/config');
const config_keys = require('../config/keys');
const sprintf = require("sprintf-js").sprintf;
const _ = require('lodash');

const eventKeys = module.exports.eventKeys = {
    i_am_student: 'i_am_student',
    i_am_head_teacher: 'i_am_head_teacher',
    today_class_schedule: 'today_class_schedule',
    unbind: 'unbind'
};

const pageUrls = module.exports.pageUrls = {
    bind: '#/wechat_oauth?target=/bind',
    unbind: '#/wechat_oauth?target=/unbind',
    class_schedule: '#/class_schedule',
    score: '#/score',
    cet: '#/cet',
    exam_schedule: '#/exam/schedule',
    rewards: '#/rewards',
    behavior: '#/behavior',
};

const redirectUrlToPage =
module.exports.redirectUrlToPage = function (page) {
    //const redirctUrl = encodeURIComponent(sprintf('http://%s/%s', config.HOST_DOMAIN, page));
    //const url = sprintf('https://open.weixin.qq.com/connect/oauth2/authorize?appid=%s&redirect_uri=%s&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect', config_keys.WECHAT_APPID, redirctUrl);
    const url = sprintf('http://%s/%s', config.HOST_DOMAIN, page);
    return url;
};

module.exports.bind = function() {
    const url = redirectUrlToPage(pageUrls.bind);
    const reply = sprintf('<a href="%s">【点击这里绑定学号】</a>\n\n绑定后即可查询', url);
    return reply;
};

module.exports.commands = function() {
    return '请回复下列命令:\n'
            + '1. 今日课表\n'
            + '2. 学期成绩\n'
            + '3. 四六级成绩\n'
            + '4. 考试安排\n'
            + '5. 奖惩信息\n'
            + '6. 行为学分\n'
            + '7. 解绑\n'
};

module.exports.openPage = function(title, page) {
    const url = redirectUrlToPage(page);
    const reply = sprintf('<a href="%s">【点击这里查看%s】</a>', url, title);
    return reply;
};

module.exports.welcome = function() {
    return '欢迎关注\n' + module.exports.commands();
};

module.exports.refollow = function() {
    return '欢迎回来\n' + module.exports.commands();
};

module.exports.bindSuccess = function() {
    return '绑定成功\n' + module.exports.commands();
};

module.exports.unsupported = function () {
    return '暂不支持该消息\n' + module.exports.commands();
};

module.exports.serverError = function() {
    return '服务器错误, 请稍后再试';
};


module.exports.today_class_schedule = function (schedule) {
    //const json = JSON.stringify(schedule, null, 4);

    // schedule = {day, week, list}
    var content = '';
    if (schedule.list.length == 0) {
        content = '今天没课\n';
    } else {
        _(schedule.list).forEach(function(item) {
            if (item.jsjc > item.qsjc) {
                content += sprintf('第%d-%d节: %s\n', item.qsjc, item.jsjc, item.kcmc);
            } else {
                content += sprintf('第%d节: %s\n', item.qsjc, item.kcmc);
            }
        });
    }

    const more = sprintf('\n<a href="%s">【点击这里本周课表】</a>', redirectUrlToPage(pageUrls.class_schedule));
    return content + more;
};