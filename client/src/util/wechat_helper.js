const HOST_DOMAIN = require('../../../server/config/config').HOST_DOMAIN;
const WECHAT_APPID = require('../../../server/config/keys').WECHAT_APPID;
console.log(WECHAT_APPID);
module.exports = {
    isWeixinBrowser: function () {
        return /micromessenger/i.test(navigator.userAgent);
    },
    redirectUrlToPage: function (page) {
        const redirctUrl = encodeURIComponent(`http://${HOST_DOMAIN}/${page}`);
        const url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${WECHAT_APPID}&redirect_uri=${redirctUrl}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`;
        return url;
    }
};