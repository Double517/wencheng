const keys = require('../config/keys');
const WechatAPI = require('co-wechat-api');
const wechat_api = new WechatAPI(keys.WECHAT_APPID, keys.WECHAT_APPSECRET);
const robot = require('./robot').robot;

module.exports.wechat_api = wechat_api;
module.exports.robot = robot;

