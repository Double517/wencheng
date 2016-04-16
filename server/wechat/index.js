var wechat = require('co-wechat');

module.exports.robot = function *() {
    var info = this.weixin;
    if (info.Content === '=') {
        var exp = this.wxsession.text.join('');
        this.wxsession.text = '';
        this.body = exp;
        console.log(this.body);
    } else {
        this.wxsession.text = this.wxsession.text || [];
        this.wxsession.text.push(info.Content);
        this.body = '收到' + info.Content;
        console.log(this.body);
    }
}