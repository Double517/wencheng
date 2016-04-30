/**
 * Created by jf on 15/12/10.
 */

"use strict";

import React from 'react';
import Page from '../../component/page';
import ListView from '../../component/ListView';

export default class RewardsDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sections: [],
        };
    }
    componentDidMount() {
        this.loadDetail();
    }
    loadDetail() {
        var data = this.props.params.data;
        if (!data) {
            this.page.showAlert('没有数据传入');
            return;
        }

        var item = JSON.parse(decodeURIComponent(data));

        var rows = Object.keys(item).map(function (key) {
            var title = key;
            var subTitle = item[key];
            return {title: title, subTitle: subTitle, key:title+subTitle};
        });
        var section = {header: {title: ''}, rows: rows};
        console.log([section]);
        this.setState({sections: [section]});
    }
    render() {
        return (
            <Page ref="page" className="cell" title="奖惩信息">
                <ListView sections={this.state.sections} />
            </Page>
        );
    }

    get page() {
        return this.refs.page;
    }
};
