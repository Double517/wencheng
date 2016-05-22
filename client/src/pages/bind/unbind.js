"use strict";

import React from 'react';
import { ButtonArea,
    Button,
    CellHeader,
    CellBody,
    Form,
    FormCell,
    Input,
    Label,
    Toast,
} from 'react-weui';

const wx = require('weixin-js-sdk');
import Ajax from '../../util/ajax';
import auth from '../../util/auth.js';
import Page from '../../component/page';

export default class Bind extends React.Component {
    constructor (props) {
        super(props);
    }
    componentDidMount() {
        this.loadWXConfig();
    }
    render() {
        return (
            <Page ref="page" className="cell" title="解绑">
                <ButtonArea>
                    <Button type='warn'
                            onClick={e=>this.submit(e)}>
                        解绑
                    </Button>
                    <Button type='primary'
                            onClick={e=>this.cancel(e)}>
                        取消
                    </Button>
                </ButtonArea>
            </Page>
        );
    }
    // 拿到微信接口权限
    loadWXConfig() {
        var url = location.protocol + '//' + location.host + location.pathname;
        Ajax.post('/api/wechat/getJsConfig', {url:url})
            .then((data) => {
                wx.config(data);
            })
            .catch((err) => {
                this.page.showAlert(err.msg);
            });
    }
    submit(event) {
        this.page.showLoading();
        Ajax.post('/api/wechat/unbind')
            .then((data) => {
                this.page.showSuccess('解绑成功');
                auth.didLogout();
                wx.closeWindow();
            })
            .catch((err) => {
                this.page.showAlert(err.msg);
            });
    }
    cancel(event) {
        wx.closeWindow();
    }

    get page() {
        return this.refs.page;
    }
};