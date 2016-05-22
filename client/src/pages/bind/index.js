/**
 * Created by jf on 15/12/10.
 */

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

import { withRouter } from 'react-router'
const wx = require('weixin-js-sdk');
import Ajax from '../../util/ajax';
import auth from '../../util/auth.js';
import Page from '../../component/page';
import getQueryParameter from '../../util/getQueryParameter';


class Bind extends React.Component {
    constructor (props) {
        super(props);
    }
    componentDidMount() {
        this.loadWXConfig();
    }
    render() {
        var isInputValid = this.isValidInput;
        return (
            <Page ref="page" className="cell" title="绑定">
                <Form>
                    <FormCell>
                        <CellHeader>
                            <Label style={{width:'60px'}}>账号</Label>
                        </CellHeader>
                        <CellBody>
                        <Input onChange={e=>this.onUsernameChange(e)} ref="username" type="text" placeholder="请输入账号"/>
                    </CellBody>
                    </FormCell>
                    <FormCell>
                        <CellHeader>
                            <Label style={{width:'60px'}}>密码</Label>
                        </CellHeader>
                        <CellBody>
                            <Input onChange={e=>this.onPasswordChange(e)} ref="password" type="password" placeholder="请输入密码"/>
                        </CellBody>
                    </FormCell>
                </Form>

                <ButtonArea>
                    <Button type={isInputValid?'primary':'default'}
                            disabled={!isInputValid}
                            onClick={e=>this.submit(e)}>
                        确定
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
    onPasswordChange(event) {
        this.setState({password: event.target.value});
    }
    onUsernameChange(event) {
        this.setState({username: event.target.value});
    }
    get isValidInput() {
        return this.state
            && this.state.username
            && this.state.username.length > 0
            && this.state.password
            && this.state.password.length > 0;
    }
    submit(event) {

        // for debug
        //wx.closeWindow();

        if (!this.isValidInput) {
            return;
        }

        this.page.showLoading();
        var data = {
            username: this.state.username,
            password: this.state.password,
        };
        console.log(data);
        Ajax.post('/api/wechat/bind', data)
            .then((data) => {
                this.page.showSuccess('绑定成功');
                auth.didLogin(data);

                var target = getQueryParameter('target');
                if (target) {
                    this.props.router.replace(target);
                } else {
                    wx.closeWindow();
                }
            })
            .catch((err) => {
                this.page.showAlert(err.msg);
            });
    }

    get page() {
        return this.refs.page;
    }
}

export default withRouter(Bind);

