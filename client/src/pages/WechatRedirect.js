import React from 'react'
import Ajax from '../util/ajax';
import Page from '../component/page';
import auth from '../util/auth.js';

export default class WechatRedirect extends React.Component {
    componentDidMount() {
        var code = getParameterByName('code');
        var target = getParameterByName('target');

        var data = {code, target, hash:window.location.hash};
        console.log(data);

        Ajax.post('/api/wechat/getUser', data)
            .then((data) => {
                console.log(data);
                var user = data.user;
                
                if (user.userid) {
                    auth.didLogin(user);
                    window.location.hash = target;
                } else {
                    window.location.hash = '#/bind';
                }
            })
            .catch((err) => {
                this.page.showAlert(err.msg);
            });
    }

    render() {
        return (
            <Page ref="page" className="cell" title="跳转中">
                <p>跳转中</p>
            </Page>
        );
    }

    get page() {
        return this.refs.page;
    }
};

function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.href);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}