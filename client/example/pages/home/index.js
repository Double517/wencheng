/**
 * Created by jf on 15/12/10.
 */

"use strict";

import React from 'react';
import Page from '../../component/page';
import './index.less';
import {
    Button,ButtonArea
} from 'react-weui';


export default class Home extends React.Component {

    render() {
        return (
            <Page ref="page" className="home" title="WeUI" subTitle="为微信Web服务量身设计">
                <ButtonArea>
                    <Button>确定</Button>
                    <Button type="default">取消</Button>
                    <Button onClick={(e)=>this.showSuccessToast(e)}>showSuccessToast</Button>
                    <Button onClick={(e)=>this.showSuccessToast(e, 'success')}>showSuccessToast('success')</Button>
                    <Button onClick={(e)=>this.showErrorToast(e)}>showErrorToast</Button>
                    <Button onClick={(e)=>this.showErrorToast(e, 'error')}>showErrorToast('error')</Button>
                    <Button onClick={(e)=>this.showLoading(e, 'loading')}>showLoading('loading')</Button>
                    <Button onClick={(e)=>this.hideLoading(e)}>hideLoading</Button>
                </ButtonArea>
            </Page>
        );
    }

    showSuccessToast(e, msg){
        this.page.showSuccess(msg);
    }
    showErrorToast(e, msg){
        this.page.showError(msg);
    }
    showLoading(e, msg) {
        this.page.showLoading(msg);

        setTimeout(()=> {
            this.page.showSuccess('sss');
        }, 2000);
    }
    hideLoading(e) {
        this.page.hideToast();
    }

    get page() {
        return this.refs.page;
    }
};
