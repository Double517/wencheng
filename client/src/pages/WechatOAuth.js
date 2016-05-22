import React from 'react'
import Page from '../component/page';
import wx_helper from '../util/wechat_helper';

export default class WechatOAuth extends React.Component {
    componentDidMount() {
        console.log(this.props);

        var target = null;
        const { location } = this.props;
        if (location.state && location.state.nextPathname) {
            target = location.state.nextPathname;
        } else {
            target = getParameterByName('target');
        }

        console.log(target);
        const url = wx_helper.redirectUrlToPage(`#/redirect?target=${target}`);
        console.log(url);
        window.location = url;
    }

    render() {
        return (
            <Page ref="page" className="cell" title="授权中">
                <p>授权中</p>
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