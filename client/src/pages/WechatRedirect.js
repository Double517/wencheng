import React from 'react'
import Ajax from '../util/ajax';
import Page from '../component/page';
import auth from '../util/auth.js';
import { withRouter } from 'react-router'
import getQueryParameter from '../util/getQueryParameter';

class WechatRedirect extends React.Component {
    componentDidMount() {
        var code = getQueryParameter('code');
        var target = getQueryParameter('target');

        var data = {code, target, hash:window.location.hash};
        console.log(data);

        Ajax.post('/api/wechat/getUser', data)
            .then((data) => {
                console.log(data);
                var user = data.user;
                
                if (user.userid) {
                    auth.didLogin(user);
                    this.props.router.replace(target);
                } else {
                    console.log({target});
                    if (target === '/bind') {
                        this.props.router.replace('/bind');
                    } else {
                        this.props.router.replace('/bind?target='+target);
                    }
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
}

export default withRouter(WechatRedirect);