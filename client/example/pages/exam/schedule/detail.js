/**
 * Created by jf on 15/12/10.
 */

"use strict";

import React from 'react';
import Page from '../../../component/page';
import ListView from '../../../component/ListView';

export default class ExamScheduleDetail extends React.Component {
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
            sj: '时间',
            dd: '地点',
            km: '考试科目',
            xxxz: '学习性质',
            bz: '学习备注',
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
            <Page ref="page" className="cell" title="考试安排">
                <ListView sections={this.state.sections} />
            </Page>
        );
    }

    get page() {
        return this.refs.page;
    }
};
