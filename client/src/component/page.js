/**
 * Created by jf on 15/12/10.
 */

"use strict";

import React from 'react';
import {Toast, Dialog} from 'react-weui';
const {Alert, Confirm} = Dialog;
import $ from 'webpack-zepto';

import './page.less';

export default class Page extends React.Component {

    constructor (props) {
        super(props);

        this.state = {
            toast: {show: false, icon:'', msg:''},
            alert: {show: false, title:'', content:'', buttons:[]},
            confirm: {show: false, title:'', content:'', buttons:[]},
        };
        this.toastTimer = null;
    }

    componentDidMount() {
        document.title = this.props.title;

        // iOS的wechat无法通过document.title改变页面title
        var $iframe = $('<iframe src="/favicon.ico"></iframe>').on('load', function() {
            setTimeout(function() {
                $iframe.off('load').remove()
            }, 0);
        }).appendTo($('body'));
    }

    componentWillUnmount() {
        this.toastTimer && clearTimeout(this.toastTimer);
    }

    render() {
        const {title, subTitle, spacing, className, children} = this.props;

        return (
            <section className={`page ${className}`}>
                <div className={`bd ${spacing ? 'spacing' : ''}`}>
                    {children}
                </div>
                <Toast show={this.state.showToast}>完成</Toast>
                <Toast icon={this.state.toast.icon}
                       show={this.state.toast.show}>
                    {this.state.toast.msg}
                </Toast>
                <Alert title={this.state.alert.title} buttons={this.state.alert.buttons} show={this.state.alert.show}>
                    {this.state.alert.content}
                </Alert>
                <Confirm title={this.state.confirm.title} buttons={this.state.confirm.buttons} show={this.state.confirm.show}>
                    {this.state.confirm.content}
                </Confirm>
            </section>
        );
    }


    hideAll() {
        if (this.state.toast.show) {
            this.hideToast();
        }
        if (this.state.alert.show) {
            this.hideAlert();
        }
        if (this.state.confirm.show) {
            this.hideConfirm();
        }
    }

    showToast(icon, msg, duration) {
        this.hideAll();

        if (this.toastTimer) {
            clearTimeout(this.toastTimer);
            this.toastTimer = null;
        }

        this.setState({toast:{icon:icon, show:true, msg:msg}});

        if (duration) {
            this.toastTimer = setTimeout(()=> {
                this.hideToast();
            }, duration * 1000);
        }
    }
    hideToast() {
        this.setState({toast:{show:false}});
    }

    showSuccess(msg) {
        this.showToast('toast', msg?msg:'成功', 1.5);
    }

    showLoading(msg) {
        this.showToast('loading', msg?msg:'加载中...');
    }

    showAlert(content, buttons, title = '错误') {
        this.hideAll();
        if (!buttons) {
            buttons = [{
                label: '好的',
                onClick: this.hideAlert.bind(this)
            }];
        }
        var alert = {
            title: title,
            content: content,
            buttons: buttons,
            show:true
        };
        this.setState({alert:alert});
    }
    hideAlert() {
        this.setState({alert: {show: false, title:'', content:'', buttons:[]}});
    }

    showConfirm(title, content, buttons) {
        this.hideAll();
        var confirm = {
            title: title,
            content: content,
            buttons: buttons,
            show:true
        };
        this.setState({confirm: confirm});
    }
    hideConfirm() {
        this.setState({confirm: {show: false, title:'', content:'', buttons:[]}});
    }
};
