/**
 * Created by jf on 15/12/10.
 */

"use strict";

import React from 'react';
import Page from '../../component/page';
import ListView from '../../component/ListView';

export default class ScoreDetail extends React.Component {
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
        var titles = {
            kcjc: '课程名称',
            xf: '学分',
            cj: '成绩',
            xfjd: '学分绩点',
            xxxzmc: '学习性质',
            cjxzmc: '成绩性质',
            ksxzmc: '考试性质',
            xqbs: '取得学期',
            bz:'备注'
        };

        var rows = Object.keys(titles).map(function (key) {
            var title = titles[key];
            var subTitle = item[key];
            return {title: title, subTitle: subTitle, key:title+subTitle};
        });
        var section = {header: {title: ''}, rows: rows};
        console.log([section]);
        this.setState({sections: [section]});
    }
    render() {
        return (
            <Page ref="page" className="cell" title="成绩">
                <ListView sections={this.state.sections} />
            </Page>
        );
    }

    get page() {
        return this.refs.page;
    }
};
