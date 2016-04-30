/**
 * Created by jf on 15/12/10.
 */

"use strict";

import React from 'react';
import Page from '../../component/page';
import ListView from '../../component/ListView';
import {getWXCode, splitArray} from '../../util/index';

export default class Behavior extends React.Component {
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
        $.getJSON('api/student/behavior', {code: getWXCode()}, (data, status) => {
            console.log(data);
            if (status === 'success' && data.code === 0) {

                var list = data.data.list;
                var items = list.map((row) => {
                    return {
                        title: row['行为名称'],
                        subTitle: '',
                        jumpUrl: '#/behavior/detail/' + JSON.stringify(row),
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
            <Page className="cell" title="行为学分">
                <ListView sections={this.state.sections} />
            </Page>
        );
    }
};
