/**
 * Created by jf on 15/12/10.
 */

"use strict";

import React from 'react';
import Page from '../../component/page';
import ListView from '../../component/ListView';
import {getWXCode, splitArray} from '../../util/index';

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
        $.getJSON('api/student/score/all', {code: getWXCode()}, (data, status) => {
            console.log(data);
            if (status === 'success' && data.code === 0) {

                var filter = this.props.params.filter;
                var displayAll = (filter === 'all');

                var bucket = splitArray(data.data.list, 'xqbs');
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
                            jumpUrl: '#/score/detail/' + JSON.stringify(row),
                        };
                    });

                    sections.push({header: {title: title, access: true}, rows: items});

                    sections.push({header: {title: '更多', access: true}, rows: [{
                        title: '查看所有成绩',
                        subTitle: '',
                        jumpUrl: '#/score/all/',
                    }]});
                }

                console.log(sections);
                this.setState({sections: sections});
            } else {
                alert(data);
            }
        });
    }
    render() {
        return (
            <Page className="cell" title="成绩">
                <ListView sections={this.state.sections} />
            </Page>
        );
    }
};
