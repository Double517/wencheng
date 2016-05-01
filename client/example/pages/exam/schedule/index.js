/**
 * Created by jf on 15/12/10.
 */

"use strict";

import React from 'react';
import Page from '../../../component/page';
import ListView from '../../../component/ListView';

import Ajax from '../../../util/ajax';

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
        Ajax.get('api/student/exam/schedule')
            .then((data) => {
                var list = data.list;
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
            })
            .catch((err) => {
                this.page.showAlert(err.msg);
            });
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
