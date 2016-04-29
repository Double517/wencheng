/**
 * Created by jf on 15/12/10.
 */

"use strict";

import React from 'react';
import {Toast} from 'react-weui';

import './page.less';

export default class Page extends React.Component {

    constructor (props) {
        super(props);

        this.state = {
            toast: {show: false, icon:'', msg:''},
        };
        this.toastTimer = null;
    }
    componentWillUnmount() {
        this.toastTimer && clearTimeout(this.toastTimer);
    }

    render() {
        const {title, subTitle, spacing, className, children} = this.props;

        return (
            <section className={`page ${className}`}>
                <div className="hd">
                    <h1 className="title">{title}</h1>
                    <p className="sub_title">{subTitle}</p>
                </div>
                <div className={`bd ${spacing ? 'spacing' : ''}`}>
                    {children}
                </div>
                <Toast show={this.state.showToast}>完成</Toast>
                <Toast icon={this.state.toast.icon}
                       show={this.state.toast.show}>
                    {this.state.toast.msg}
                </Toast>
            </section>
        );
    }

    showToast(icon, msg, duration) {
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
    showError(msg) {
        this.showToast('success', msg?msg:'失败', 1.5);
    }
    showLoading(msg) {
        this.showToast('loading', msg?msg:'加载中...');
    }
};
