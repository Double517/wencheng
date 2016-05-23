import React from 'react'
import { withRouter } from 'react-router'

import auth from '../../util/auth'

import {
    Button,
    ButtonArea,
} from 'react-weui';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {loggedIn: auth.loggedIn()};
    }

    updateAuth(loggedIn) {
        this.setState({
            loggedIn: !!loggedIn
        })
    }

    componentWillMount() {
        auth.onChange = this.updateAuth.bind(this);
        auth.login();
    }

    render() {
        return (
            <div>
                <ButtonArea direction="horizontal">
                    <Button type="primary" size="small" onClick={e=>this.jump(e, '/')}>首页</Button>
                    <Button type="default" size="small" onClick={e=>this.jump(e, '/about')}>关于</Button>
                    <Button type="default" size="small"
                            onClick={e=>this.login(e)}>{this.state.loggedIn ? '登出' : '登录'}</Button>
                </ButtonArea>
                {this.props.children}
            </div>
        )
    }

    login() {
        if (this.state.loggedIn) {
            this.props.router.replace('logout');
        } else {
            this.props.router.replace('login');
        }
    }

    jump(e, page) {
        this.props.router.replace(page);
    }
}

export default withRouter(App);
