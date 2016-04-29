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
                    <Button size="small" onClick={(e)=>this.showSuccessToast(e)}>showSuccessToast</Button>
                    <Button size="small" onClick={(e)=>this.showSuccessToast(e, 'success')}>showSuccessToast('success')</Button>
                    <Button size="small" onClick={(e)=>this.showLoading(e, 'loading')}>showLoading('loading')</Button>
                    <Button size="small" onClick={(e)=>this.hideLoading(e)}>hideLoading</Button>
                    <Button size="small" onClick={(e)=>this.showAlert(e)}>showAlert</Button>
                    <Button size="small" onClick={(e)=>this.showConfirm(e)}>showConfirm</Button>
                </ButtonArea>
            </Page>
        );
    }

    showSuccessToast(e, msg){
        this.page.showSuccess(msg);
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
    showAlert(e) {
        //this.page.showAlert('hahah');
        this.page.showAlert('hahah', null, 'title');
    }
    showConfirm(e) {
        //this.page.showAlert('hahah');
       var buttons = [
            {
                type: 'default',
                label: '好的',
                onClick: this.hideConfirm.bind(this)
            },
            {
                type: 'primary',
                label: '我愿意',
                onClick: this.hideConfirm.bind(this)
            }
        ];
        this.page.showConfirm('title', 'content', buttons);
    }
    hideConfirm() {
        this.page.hideConfirm();
    }

    get page() {
        return this.refs.page;
    }
};
