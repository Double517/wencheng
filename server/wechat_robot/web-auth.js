/**
 * Created by wujichao on 16/4/19.
 */
"use strict"

const sprintf = require("sprintf-js").sprintf;
const keys = require('../config/keys');
const _ = require('lodash');
const http_request = require('./request');
const assert = require('chai').assert;
const db = require('../database');

const openid_cache = {};

module.exports = function *(next){
    const code = this.query.code || this.request.body.code;
    if (!_.isString(code)) {
        return yield *next;
    }

    // code不同账号可能是一样的 擦了...
    var openid = null;//openid_cache.code;
    if (openid) {
        console.log('hit! code ' + code + ' openid ' + openid);
    } else {
        console.log('not hit! code ' + code);

        const url = sprintf('https://api.weixin.qq.com/sns/oauth2/access_token?appid=%s&secret=%s&code=%s&grant_type=authorization_code',
            keys.WECHAT_APPID, keys.WECHAT_APPSECRET, code);

        let body;
        try {
            body = yield http_request(url);
        } catch(err) {
            console.log(err);
            throw err;
        }

        console.log(body);
        openid = body.openid;
        assert(_.isObject(body) && _.isString(body.openid));

        // cache
        openid_cache.code = openid;
    }

    this.openid = openid;


    // openid 换 userid
    const request = yield db.request();
    request.input('openid', this.openid);
    const result = yield request.queryOne('select userid from wechat_bind where openid=@openid');
    if (result) {
        this.userid = result.userid;
    } else {
        // TODO: 这里做个校验 还需要重新规划下路径
        //未绑定, 理论上只有get_bind和post_bind才会未绑定
    }

    console.log('wechat web auth code '+ code + ' -> this.openid ' + this.openid + ' -> userid ' + this.userid);
    yield *next;
};