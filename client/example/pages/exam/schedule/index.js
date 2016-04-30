/**
 * Created by jf on 15/12/10.
 */

"use strict";

import React from 'react';
import Page from '../../../component/page';
import ListView from '../../../component/ListView';
import {getWXCode, splitArray} from '../../../util/index';

export default class ExamSchedule extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sections: [],
        };
    }
    componentDidMount() {
        this.loadSchedule();
    }
    loadSchedule() {
        $.getJSON('api/student/exam/schedule', {code: getWXCode()}, (data, status) => {
            console.log(data);
            if (status === 'success' && data.code === 0) {

                var list = data.data.list;
                var items = list.map((row) => {
                    // TODO: 换成article样式
                    return {
                        title: row.km,
                        subTitle: '',/*row.sj*/
                        jumpUrl: '#/exam/schedule/detail/' + encodeURIComponent(JSON.stringify(row)),
                        key: row.km+row.sj /*科目+时间*/
                    };
                });
                var section = {header: {title: '', access: true}, rows: items};
                console.log(section);

                this.setState({sections: [section]});
            } else {
                alert(data);
            }
        });
    }
    render() {
        return (
            <Page className="cell" title="考试安排">
                <ListView sections={this.state.sections} />
            </Page>
        );
    }
};
