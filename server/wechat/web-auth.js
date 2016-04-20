/**
 * Created by wujichao on 16/4/19.
 */
"use strict"

const sprintf = require("sprintf-js").sprintf;
const keys = require('../config/keys');
const _ = require('lodash');
const request = require('./request');
const assert = require('chai').assert;

module.exports = function *(next){
    // const code = this.query.code;
    // if (!_.isString(code)) {
    //     return yield *next;
    // }
    const code = this.request.body.code;
    if (!_.isString(code)) {
        return yield *next;
    }

    const url = sprintf('https://api.weixin.qq.com/sns/oauth2/access_token?appid=%s&secret=%s&code=%s&grant_type=authorization_code',
                keys.WECHAT_APPID, keys.WECHAT_APPSECRET, code);

    let body;
    try {
        body = yield request(url);
    } catch(err) {
        console.log(err);
        throw err;
    }

    console.log(body);
    this.openid = body.openid;

    assert(_.isObject(body) && _.isString(body.openid));

    console.log('wechat web auth code '+ code + ' -> openid ' + this.openid);
    yield *next;
};