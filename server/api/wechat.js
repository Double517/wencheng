const constants = require('../constants');
const db = require('../database');
const apiError = require('../api/error');
const api = require('../api');
const assert = require('chai').assert;
const wechat_api = require('../wechat_robot').wechat_api;
const messages = require('../wechat_robot/messages');
const keys = require('../config/keys');
const _ = require('lodash');
const http_request = require('../wechat_robot/request');
const sprintf = require("sprintf-js").sprintf;


module.exports.bind = function *()
{
    const userid = this.request.body.username;
    const password = this.request.body.password;
   // const openid = this.openid;
    const openid = this.session.openid;

    if (!userid || !password) {
        this.body = api.return(apiError.parameter_invalid);
        return;
    }
    if (!openid) {
        this.body = api.return(apiError.server_error);
        return;
    }

    //1 账号密码 校验
    //2 服务端获取openid
    //3 是否已绑过
    //4 存进去数据库
    //5 返回成功

    const request = yield db.request();
    request.input('userId', userid);
    request.input('pwd', password);
    const r = yield request.execute('Web用户登录判断');

    const userType = r.returnValue;
    if (userType === constants.USER_TYPE_STUDENT ||
        userType === constants.USER_TYPE_TEACHER ||
        userType === constants.USER_TYPE_HEAD_TEACHER) {

        const request1 = yield db.request();
        request1.input('openid', openid);
        const r1 = yield request1.queryOne('select userid from wechat_bind where openid=@openid');
        if (r1) {
            this.body = api.return(apiError.error(-1, '已绑定' + JSON.stringify(r1)));
            return;
        }

        const request2 = yield db.request();
        request2.input('openid', openid);
        request2.input('userid', userid);
        request2.input('usertype', userType);
        const r2 = yield request2.query('insert into wechat_bind values (@openid,@userid,@usertype)');

        assert(r2 === undefined);

        var groupId = 0;
        switch (userType) {
            case constants.USER_TYPE_STUDENT:
                groupId = constants.USER_TYPE_STUDENT_GROUP_ID;
                break;
            case constants.USER_TYPE_TEACHER:
                groupId = constants.USER_TYPE_HEAD_TEACHER_GROUP_ID;
                break;
            case constants.USER_TYPE_HEAD_TEACHER:
                groupId = constants.USER_TYPE_HEAD_TEACHER_GROUP_ID;
                break;
            default:
                assert(false);
                break;
        }
        const move_result = yield wechat_api.moveUserToGroup(openid, groupId);
        assert(move_result.errcode == 0);

        // const ensure_resule = yield wechat_api.getWhichGroup(openid);
        // console.log(ensure_resule);

        // 回复用户
        yield wechat_api.sendText(openid, messages.bindSuccess());

        // session
        const user = {userid: userid, openid: openid, usertype: userType};
        this.session.user = user;

        //
        this.body = api.success(user);
    } else {
        this.body = api.return(apiError.password_error);
    }
};

module.exports.unbind = function *()
{
    const user = this.session.user;
    console.log(user);
    if (!user) {
        this.body = api.return(apiError.error(-1, '没有绑定'));
        return;
    }

    const openid = user.openid;
    const request = yield db.request();
    request.input('openid', openid);
    var result = yield request.query('delete from wechat_bind where openid=@openid');

    if (result === undefined) {
        this.session = null;
        this.body = api.success();
    } else {
        this.body = api.return(apiError.error(-1, '解绑失败'));
    }
};

module.exports.getJsConfig = function *()
{
    const url = this.request.body.url;
    console.log({url: url});
    // TODO: jsApiList as params

    const param = {
        debug: true,
        jsApiList: ['closeWindow'],
        url: url
    };
    const jsconfig = yield wechat_api.getJsConfig(param);
    console.log(jsconfig);

    this.body = api.return(jsconfig);
};

module.exports.getUser = function *()
{
    const code = this.request.body.code;
    if (!_.isString(code)) {
        throw Error('code = null');
    }

    // code 换 openid
    //
    var openid = null;
    const url = sprintf('https://api.weixin.qq.com/sns/oauth2/access_token?appid=%s&secret=%s&code=%s&grant_type=authorization_code',
        keys.WECHAT_APPID, keys.WECHAT_APPSECRET, code);
    try {
        var body = yield http_request(url);
        console.log(body);
        openid = body.openid;
        assert(_.isObject(body) && _.isString(body.openid));
    } catch(err) {
        console.log(err);
        throw err;
    }

    // openid 换 userid
    //
    var userid = null;
    const request = yield db.request();
    request.input('openid', openid);
    const result = yield request.queryOne('select * from wechat_bind where openid=@openid');
    if (result) {
        userid = result.userid;
        this.session.user = result; //{userid, openid, usertype}
    } else {
        // 记录openid, 给后面绑定用
        this.session.openid = openid;
    }

    console.log('getOpenID code '+ code + ' -> this.openid ' + openid + ' -> userid ' + userid);
    this.body = api.return({getOpenid: !!openid, user:{userid:userid}});
};