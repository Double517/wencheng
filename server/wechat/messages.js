/**
 * Created by wujichao on 16/4/20.
 */
const config = require('../config/config');
const keys = require('../config/keys');
const sprintf = require("sprintf-js").sprintf;
const _ = require('lodash');

const redirectUrlToPage =
module.exports.redirectUrlToPage = function (page) {
    const redirctUrl = encodeURIComponent(sprintf('http://%s/%s', config.HOST_DOMAIN, page));
    const url = sprintf('https://open.weixin.qq.com/connect/oauth2/authorize?appid=%s&redirect_uri=%s&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect', keys.WECHAT_APPID, redirctUrl);
    return url;
};

module.exports.bind = function() {
    const url = redirectUrlToPage('#/bind');
    const reply = sprintf('<a href="%s">【点击这里绑定学号】</a>\n\n绑定后即可查询', url);
    return reply;
};

module.exports.refollow = function() {
    return 'welcome refollow';
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

    const more = sprintf('\n<a href="%s">【点击这里本周课表】</a>', redirectUrlToPage('api/student/class_schedule'));
    return content + more;
};