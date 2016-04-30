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
            <Page ref="page" className="home" title="面板" subTitle="">
                <ButtonArea>
                    <Button>确定</Button>
                    <Button type="default">取消</Button>
                    
                    <Button onClick={(e)=>this.jump(e, 'bind')}>绑定</Button>
                    <Button onClick={(e)=>this.jump(e, 'class_schedule')}>课表</Button>
                    <Button onClick={(e)=>this.jump(e, 'score')}>成绩</Button>
                    <Button onClick={(e)=>this.jump(e, 'cet')}>四六级</Button>
                    <Button onClick={(e)=>this.jump(e, 'exam/schedule')}>考试安排</Button>
                    <Button onClick={(e)=>this.jump(e, 'behavior')}>行为学分</Button>
                    <Button onClick={(e)=>this.jump(e, 'rewards')}>奖惩</Button>

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

    jump(e, url) {
        window.location.hash = '#'+url;
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
