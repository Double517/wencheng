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
import Ajax from '../../util/ajax';
import auth from '../../util/auth.js';
import Page from '../../component/page';
import getQueryParameter from '../../util/getQueryParameter';


class Login extends React.Component {
    constructor (props) {
        super(props);
    }
    componentDidMount() {
        ;
    }
    render() {
        var isInputValid = this.isValidInput;
        return (
            <Page ref="page" className="cell" title="登录">
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

        if (!this.isValidInput) {
            return;
        }
      
        this.page.showLoading();
        auth.login(this.state.username, this.state.password, (loggedIn, err) => {
            if (err) {
                this.page.showAlert(err.msg);
                return;
            }
            this.page.showSuccess('登录成功');

            var target = getQueryParameter('target');
            if (target) {
                this.props.router.replace(target);
            } else {
                this.props.router.replace('/');
            }
        });
    }

    get page() {
        return this.refs.page;
    }
}

export default withRouter(Login);

