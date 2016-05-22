import React from 'react'
import Page from '../component/page';
import wx_helper from '../util/wechat_helper';

export default class WechatOAuth extends React.Component {
    componentDidMount() {
        console.log(this.props);
        var target = this.props.location.state.nextPathname;
        console.log(target);
        const url = wx_helper.redirectUrlToPage(`#/redirect?target=${target}`);
        console.log(url);
        window.location = url; // window.location.replace(url);
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