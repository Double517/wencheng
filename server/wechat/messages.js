/**
 * Created by wujichao on 16/4/20.
 */
const config = require('../config/config');
const keys = require('../config/keys');
const sprintf = require("sprintf-js").sprintf;

module.exports.bind = function() {
    const redirctUrl = encodeURIComponent(sprintf('http://%s/bind', config.HOST_DOMAIN));
    const url = sprintf('https://open.weixin.qq.com/connect/oauth2/authorize?appid=%s&redirect_uri=%s&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect', keys.WECHAT_APPID, redirctUrl);
    const reply = sprintf('<a href="%s">【点击这里绑定学号】</a>\n\n绑定后即可查询', url);
    return reply;
};

module.exports.refollow = function() {
    return 'welcome refollow';
};