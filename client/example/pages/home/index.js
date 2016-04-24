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
            <Page className="home" title="WeUI" subTitle="为微信Web服务量身设计">
                <ButtonArea>
                    <Button>确定</Button>
                    <Button type="default">取消</Button>
                </ButtonArea>
            </Page>
        );
    }
};
