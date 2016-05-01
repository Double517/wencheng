/**
 * Created by jf on 15/12/10.
 */

"use strict";

import React from 'react';
import Page from '../../component/page';
import ListView from '../../component/ListView';

import Ajax from '../../util/ajax';
import splitArray from '../../util/splitArray';

export default class Score extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sections: [],
        };
    }
    componentDidMount() {
        this.loadScore();
    }
    loadScore() {
        Ajax.get('api/student/score/all')
            .then((data) => {
                var filter = this.props.params.filter;
                var displayAll = (filter === 'all');

                var bucket = splitArray(data.list, 'xqbs');
                console.log(bucket);

                var sections = [];

                if (displayAll) {
                    bucket.forEach(function (object) {
                        var title = object.key;
                        var list = object.list;

                        var items = list.map((row) => {
                            return {
                                title: row.kcjc,
                                subTitle: row.cj,
                                jumpUrl: '#/score/detail/' + JSON.stringify(row),
                                key: row.kcjc + row.cj + row.xqbs /*课程+成绩+学期*/
                            };
                        });

                        sections.push({header: {title: title, access: true}, rows: items});
                    });
                } else {
                    var object = bucket[bucket.length-1];
                    var title = object.key;
                    var list = object.list;

                    var items = list.map((row) => {
                        return {
                            title: row.kcjc,
                            subTitle: row.cj,
                            jumpUrl: '#/score/detail/' + encodeURIComponent(JSON.stringify(row)),
                            key: row.kcjc + row.cj + row.xqbs /*课程+成绩+学期*/
                        };
                    });

                    sections.push({header: {title: title, access: true}, rows: items});

                    sections.push({header: {title: '更多', access: true}, rows: [{
                        title: '查看所有成绩',
                        subTitle: '',
                        jumpUrl: '#/score/all/',
                        key: '查看所有成绩'
                    }]});
                }

                console.log(sections);
                this.setState({sections: sections});
            })
            .catch((err) => {
                this.page.showAlert(err.msg);
            });
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
