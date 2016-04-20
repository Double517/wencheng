const wechat = require('co-wechat');
const config = require('../config/config');
const keys = require('../config/keys');
const sprintf = require("sprintf-js").sprintf;
const messages = require('./messages');
const db = require('../database');

module.exports.robot = function *() {
    var info = this.weixin;

    console.log('<-- receive');
    console.log(info);

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

    const request = yield db.request();
    request.input('openid', info.FromUserName);
    const r = yield request.queryOne('select userid from wechat_bind where openid=@openid');
    if (!r) {
        this.body = yield handleSubscribeEvent(info);
        return;
    }
    this.userid = r.userid;
    console.log('from userid: ' + r.userid);

    switch(info.MsgType) {
        case 'text':
            this.body = yield handleMessage(info, this.userid);
            break;
        case 'event':
            switch(info.Event) {
                case 'subscribe':
                    this.body = yield handleSubscribeEvent(info, this.userid);
                    break;
                default:
                    this.body = 'not support';
                    break;
            }
            break;
        default:
            this.body = 'not support';
            break;
    }
    console.log('--> send');
    console.log(this.body);
};

function *handleMessage(message, userid) {
    // if (message.Content === '=') {
    //     var exp = this.wxsession.text.join('');
    //     this.wxsession.text = '';
    //     return exp;
    // } else {
    //     this.wxsession.text = this.wxsession.text || [];
    //     this.wxsession.text.push(info.Content);
    //     return '收到' + info.Content;
    // }
    return 'receive ' + message.Content + ' from userid ' + userid;
}

function *handleSubscribeEvent(message, userid) {
    if (!userid) {
        return messages.bind();
    } else {
        return messages.refollow();
    }
}