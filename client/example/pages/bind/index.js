/**
 * Created by jf on 15/12/10.
 */

"use strict";

import React from 'react';
import { ButtonArea,
    Button,
    Cells,
    CellsTitle,
    CellsTips,
    Cell,
    CellHeader,
    CellBody,
    CellFooter,
    Form,
    FormCell,
    Icon,
    Input,
    Label,
} from 'react-weui';

import Page from '../../component/page';


export default class Bind extends React.Component {
    componentDidMount() {
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
                alert('Ajax error!')
            }
        });
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
            </Page>
        );
    }
    onPasswordChange(event){
        this.setState({password: event.target.value});
    }
    onUsernameChange(event) {
        this.setState({username: event.target.value});
    }
    submit() {
        console.log(this.state);

        var data = JSON.stringify({ username: this.state.username, password: this.state.password, code: getParameterByName('code')});
        console.log(data);
        wx.closeWindow();
        $.ajax({
            type: 'POST',
            url: '/api/bind',
            data: data,
            contentType: 'application/json',
            success: function(data){
                if (data.code == 0) {
                    wx.closeWindow();
                } else {
                    alert(data.msg);
                }
            },
            error: function(xhr, type){
                alert('Ajax error!')
            }
        });
    }
};

function getParameterByName(name) {
    console.log(window.location);
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.hash);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}
