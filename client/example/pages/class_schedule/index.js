/**
 * Created by jf on 15/12/10.
 */

"use strict";

import React from 'react';
import Page from '../../component/page';
import ListView from '../../component/ListView';

import {getWXCode} from '../../util/index';

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
        $.getJSON('api/student/class_schedule', {code: getWXCode()}, (data, status) => {
            console.log(data);
            if (status === 'success' && data.code === 0) {
                //{ kcmc: '科技英语（G）', skxq: 5, qsjc: 3, jsjc: 4, zxz: 0, ksz: 1, jsz: 18, jsdm: 'GS301' }
                var bucket = [];
                var list = data.data.list;
                for (var i=0; i < list.length; i++) {
                    var item = list[i];
                    var rows = bucket[item.skxq];
                    if (!rows) {
                        rows = [];
                        bucket[item.skxq] = rows;
                    }
                    rows.push(item);
                }

                var cnChars = ['零','一','二','三','四','五','六','七','八','九'];

                var sections = [];
                bucket.forEach((e) => {
                    var title = '星期'+cnChars[e[0].skxq];
                    var items = e.map((r) => {
                        var title = '';
                        if (r.jsjc > r.qsjc) {
                            title = '第'+r.qsjc+'-'+r.jsjc+'节';
                        } else {
                            title = '第'+r.qsjc+'节';
                        }
                        return {title: title, subTitle: r.kcmc};
                    });
                    sections.push({header: {title: title}, rows: items});
                });

                console.log(sections);
                this.setState({sections: sections});
            } else {
                alert(data);
            }
        });
    }
    render() {
        return (
            <Page className="cell" title="课表">
                <ListView sections={this.state.sections} />
            </Page>
        );
    }
};
