/**
 * Created by wujichao on 16/4/21.
 */

const keys = require('../config/keys');
const WechatAPI = require('co-wechat-api');
const wechat_api = new WechatAPI(keys.WECHAT_APPID, keys.WECHAT_APPSECRET);

const render = require(('co-views'))(__dirname + '../../views', {
    map: { html: 'swig' }
});

module.exports.bind = function *() {
    // this.body = this;
    // console.log(this.openid);
    const param = {
        debug: true,
        jsApiList: ['closeWindow'],
        url: this.request.href
    };
    const jsconfig = yield wechat_api.getJsConfig(param);
    console.log(jsconfig);
    this.body = yield render('bind', {jsconfig: JSON.stringify(jsconfig)});
};