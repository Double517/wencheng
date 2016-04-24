/**
 * Created by wujichao on 16/4/20.
 */
const config = require('../config/config');
const keys = require('../config/keys');
const sprintf = require("sprintf-js").sprintf;

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
    const json = JSON.stringify(schedule, null, 4);
    const more = sprintf('\n\n<a href="%s">【点击这里查看更多】</a>', redirectUrlToPage('api/student/class_schedule'));
    return json + more;
};