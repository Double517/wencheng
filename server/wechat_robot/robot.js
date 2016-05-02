const wechat = require('co-wechat');
const config = require('../config/config');
const sprintf = require("sprintf-js").sprintf;
const messages = require('./messages');
const db = require('../database');
const eventKeys = require('./messages').eventKeys;
const pageUrls = require('./messages').pageUrls;

const assert = require('chai').assert;

const student_api = require('../api/student');
const teacher_api = require('../api/student');

function Robot(ctx, userid, prevMessage) {
    this.userid = userid || null;
    this.prevMessage = prevMessage || null;
    this.ctx = ctx;
}

Robot.prototype.setUserid = function (userid) {
    this.userid = userid;
    this.ctx.wxsession.userid = userid;
};

Robot.prototype.reply = function (s) {
    this.log('reply: ', s);
    this.ctx.body = s;
};

Robot.prototype.log = function () {
    console.log('============ wechat robot log ================');
    console.log('userid: ', this.userid);
    console.log.apply(null, arguments);
    console.log('==============================================');
};

/*
 接受消息
 { ToUserName: 'gh_1c722d49430f',
 FromUserName: 'ojb3hv0i_WXXU9QFpRDUCuzJbJDc',//OpenID
 CreateTime: '1460989282',
 MsgType: 'text',
 Content: '1',
 MsgId: '6274901186407761130' }

 { ToUserName: 'gh_1c722d49430f',
 FromUserName: 'ojb3hv0i_WXXU9QFpRDUCuzJbJDc', //OpenID
 CreateTime: '1460989323',
 MsgType: 'event',
 Event: 'unsubscribe',
 EventKey: '' }

 { ToUserName: 'gh_1c722d49430f',
 FromUserName: 'ojb3hv0i_WXXU9QFpRDUCuzJbJDc',
 CreateTime: '1460989339',
 MsgType: 'event',
 Event: 'subscribe',
 EventKey: '' }

 msgType =
 ['text', 'image', 'voice', 'video', 'shortvideo', 'location', 'link']
 ['event']
 {Event: 'subscribe' or 'unsubscribe'}
 {Event: 'CLICK', EventKey: 事件KEY值}//点击自定义菜单后,  点击菜单弹出子菜单不会产生上报。
 {Event: 'VIEW', EventKey: 事件KEY值，设置的跳转URL }//点击菜单跳转链接时的事件推送
 };
 */
/*
 回复消息
 回复文本 this.body = 'content'
 回复图片 this.body = { type: "image", content: { mediaId: 'mediaId' }
 */
Robot.prototype.handleMessage = function *(message)
{
    this.log('receive: ', message);

    if (!this.userid) {
        this.reply(messages.bind());
        return;
    }

    switch(message.MsgType) {
        case 'text':
            return yield this.handleTextMessage(message);
        case 'event':
            switch(message.Event) {
                case 'subscribe':
                    return yield this.handleSubscribeEvent(message);
                
                case 'CLICK':
                    return yield this.handleClickEvent(message);

                default:
                    return yield this.handleUnsupportedMessage(message);
            }
        default:
            return yield this.handleUnsupportedMessage(message);
    }
};

Robot.prototype.handleTextMessage = function *(message)
{
    var content = message.Content;
    if (/1/.test(content) || /课表/.test(content)) {
        message.EventKey = eventKeys.today_class_schedule;
        yield this.handleClickEvent(message);
    } else if (/3/.test(content) || /四六级/.test(content)) {
        this.reply(messages.openPage('四六级成绩', pageUrls.cet));
    } else if (/2/.test(content) || /成绩/.test(content)) {
        this.reply(messages.openPage('学期成绩', pageUrls.score));
    } else if (/4/.test(content) || /考试/.test(content)) {
        this.reply(messages.openPage('考试安排', pageUrls.exam_schedule));
    } else if (/5/.test(content) || /奖惩/.test(content)) {
        this.reply(messages.openPage('奖惩信息', pageUrls.rewards));
    } else if (/6/.test(content) || /行为/.test(content)) {
        this.reply(messages.openPage('行为学分', pageUrls.behavior));
    } else if (/7/.test(content) || /解绑/.test(content)) {
        message.EventKey = eventKeys.unbind;
        yield this.handleClickEvent(message);
    } else {
        this.reply(messages.commands());
    }
};

Robot.prototype.handleSubscribeEvent = function *(message)
{
    // TODO: regroup
    this.reply(messages.refollow());
};

Robot.prototype.handleClickEvent = function *(message)
{
    const eventKey = message.EventKey;
    switch (eventKey) {
        case eventKeys.i_am_head_teacher:
            return yield this.handleUnsupportedMessage(message);

        case eventKeys.i_am_student:
            return yield this.handleUnsupportedMessage(message);

        case eventKeys.today_class_schedule:
            const schedule = yield *student_api.get_today_class_schedule(this.userid);
            this.reply(messages.today_class_schedule(schedule));
            return;

        case eventKeys.unbind:
            return yield this.handleUnbindEvent(message);

        default:
            console.log(eventKey);
            assert(false);
            return yield this.handleUnsupportedMessage(message);
    }
};

Robot.prototype.handleUnbindEvent = function *(message)
{
    if (this.prevMessage.EventKey !== eventKeys.unbind) {
        this.reply('请再点一次解绑');
    } else {
        const openid = message.FromUserName;
        const request = yield db.request();
        request.input('openid', openid);
        var result = yield request.query('delete from wechat_bind where openid=@openid');

        if (result === undefined) {
            this.setUserid(null);
            this.reply('解绑成功');
        } else {
            this.reply(messages.serverError());
        }
    }
};

Robot.prototype.handleUnsupportedMessage = function *(message) {
    this.reply(messages.unsupported());
};


module.exports = function *() {

    var userid = this.wxsession.userid;
    var prevMessage = this.wxsession.prevMessage;

    var message = this.weixin;
    this.wxsession.prevMessage = message;

    if (!userid) {
        const request = yield db.request();
        request.input('openid', message.FromUserName);
        const r = yield request.queryOne('select userid from wechat_bind where openid=@openid');
        if (r) {
            userid = r.userid;
        }
    }

    var robot = new Robot(this, userid, prevMessage);
    return yield robot.handleMessage(message);
};