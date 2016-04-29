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

        this.state = { submitting: false, errMsg: null};
    }
    componentDidMount() {
        this.loadWXConfig();
    }
    render() {
        return (
            <Page className="cell" title="绑定">
                <Form>
                    <FormCell>
                        <CellHeader>
                            <Label>账号</Label>
                        </CellHeader>
                        <CellBody>
                        <Input onChange={this.onUsernameChange.bind(this)} ref="username" type="text" placeholder="请输入账号"/>
                    </CellBody>
                    </FormCell>
                    <FormCell>
                        <CellHeader>
                            <Label>密码</Label>
                        </CellHeader>
                        <CellBody>
                            <Input onChange={this.onPasswordChange.bind(this)} ref="password" type="password" placeholder="请输入密码"/>
                        </CellBody>
                    </FormCell>
                </Form>

                <ButtonArea>
                    <Button onClick={this.submit.bind(this)}>确定</Button>
                    <Button type="default">取消</Button>
                </ButtonArea>

                <Toast icon="loading" show={this.state.submitting}>正在加载中...</Toast>
                <Toast show={this.state.errMsg != null}>{this.state.errMsg}</Toast>
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
                this.showToast('Ajax error!');
            }
        });
    }
    onPasswordChange(event) {
        this.setState({password: event.target.value});
    }
    onUsernameChange(event) {
        this.setState({username: event.target.value});
    }
    submit() {
        console.log(this.state);

        this.setState({submitting: true});

        var data = JSON.stringify({ username: this.state.username, password: this.state.password, code: getParameterByName('code')});
        console.log(data);
        wx.closeWindow();
        $.ajax({
            type: 'POST',
            url: '/api/bind',
            data: data,
            contentType: 'application/json',
            success: (data) => {
                this.setState({submitting: false});

                if (data.code == 0) {
                    wx.closeWindow();
                } else {
                    this.showToast(data.msg);
                }
            },
            error: (xhr, type) => {
                this.showToast('Ajax error!');
            }
        });
    }

    showToast(errMsg) {
        this.setState({errMsg: errMsg});
        setTimeout(()=> {
            this.setState({errMsg: null});
        }, 1000);
    }
};

function getParameterByName(name) {
    console.log(window.location);
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.hash);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}
