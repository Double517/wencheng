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

import Page from '../../component/page';

export default class Bind extends React.Component {
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
                            <Label>账号</Label>
                        </CellHeader>
                        <CellBody>
                        <Input onChange={e=>this.onUsernameChange(e)} ref="username" type="text" placeholder="请输入账号"/>
                    </CellBody>
                    </FormCell>
                    <FormCell>
                        <CellHeader>
                            <Label>密码</Label>
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
        var data = JSON.stringify({ url: url});
        console.log(data);

        $.ajax({
            type: 'POST',
            url: '/api/getJsConfig',
            data: data,
            contentType: 'application/json',
            success: function(data){
                wx.config(data);
            },
            error: function(xhr, type){
                this.page.showError('Ajax error!');
            }
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
        var data = JSON.stringify({ username: this.state.username, password: this.state.password, code: getParameterByName('code')});
        console.log(data);
        $.ajax({
            type: 'POST',
            url: '/api/bind',
            data: data,
            contentType: 'application/json',
            success: (data) => {
                console.log(data);
                if (data.code == 0) {
                    this.page.showSuccess('绑定成功');
                    wx.closeWindow();
                } else {
                    this.page.showError(data.msg);
                }
            },
            error: (xhr, type) => {
                console.log(type);
                console.log(xhr);
                this.page.showError('Ajax error!');
            }
        });
    }

    get page() {
        return this.refs.page;
    }
};

function getParameterByName(name) {
    console.log(window.location);
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.hash);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}
