/**
 * Created by jf on 15/12/10.
 */

"use strict";

import React from 'react';
import Page from '../../component/page';
import ListView from '../../component/ListView';

import Ajax from '../../util/ajax';
import splitArray from '../../util/splitArray';

export default class ClassSchedule extends React.Component {
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
        Ajax.get('api/student/class_schedule')
            .then((data) => {
                //{ kcmc: '科技英语（G）', skxq: 5, qsjc: 3, jsjc: 4, zxz: 0, ksz: 1, jsz: 18, jsdm: 'GS301' }

                var bucket = splitArray(data.list, 'skxq');

                var sections = [];
                var cnChars = ['零','一','二','三','四','五','六','日'];

                bucket.forEach(function(object) {

                    var title = '星期'+cnChars[object.key];
                    var list = object.list;

                    var items = list.map((r) => {
                        var title = '';
                        if (r.jsjc > r.qsjc) {
                            title = '第'+r.qsjc+'-'+r.jsjc+'节';
                        } else {
                            title = '第'+r.qsjc+'节';
                        }
                        return {
                            title: title,
                            subTitle: r.kcmc,
                            key: title+r.kcmc+r.skxq /*节+课程+上课星期*/
                        };
                    });
                    sections.push({header: {title: title}, rows: items});
                });

                console.log(sections);
                this.setState({sections: sections});
            })
            .catch((err) => {
                this.page.showAlert(err.msg);
            });
    }
    render() {
        return (
            <Page ref="page" className="cell" title="课表">
                <ListView sections={this.state.sections} />
            </Page>
        );
    }

    get page() {
        return this.refs.page;
    }
};
