const constants = require('../constants');
const db = require('../database');
const apiError = require('../api/error');
const api = require('../api');
const assert = require('chai').assert;
const wechat_api = require('../wechat').wechat_api;

module.exports.bind = function *()
{
    const userid = this.request.body.username;
    const password = this.request.body.password;
    const openid = this.openid;

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

        this.body = api.success();
    } else {
        this.body = api.return(apiError.password_error);
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

    this.body = jsconfig;
};