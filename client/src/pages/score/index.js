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

                var bucket = splitArray(data.list, 'xqbs');
                console.log(bucket);

                var sections = [];

                if (filter === 'all') {
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

                    var object = null;

                    if (!filter) {
                        if (bucket.length > 0) {
                            object = bucket[bucket.length-1];
                        }
                    } else {
                        bucket.forEach(function (o) {
                            if (filter === o.key) {
                                object = o;
                            }
                        });
                    }

                    if (object) {
                        var title = object.key;
                        var list = object.list;

                        var terms = bucket.map(object => {
                            return object.key;
                        });

                        var items = list.map((row) => {
                            return {
                                title: row.kcjc,
                                subTitle: row.cj,
                                jumpUrl: '#/score/detail/' + encodeURIComponent(JSON.stringify(row)),
                                key: row.kcjc + row.cj + row.xqbs /*课程+成绩+学期*/
                            };
                        });

                        sections.push({header: {title: '', access: true}, rows: [{
                            title: '学期',
                            subTitle: title,
                            jumpUrl: '#/score/select/' + encodeURIComponent(JSON.stringify(terms)),
                            key: '选择学期'
                        }]});

                        sections.push({header: {title: '', access: true}, rows: items});
                    }
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
