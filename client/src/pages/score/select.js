/**
 * Created by jf on 15/12/10.
 */

"use strict";

import React from 'react';
import Page from '../../component/page';
import ListView from '../../component/ListView';

export default class ScoreSelect extends React.Component {
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

        var terms = JSON.parse(decodeURIComponent(data));
        var rows = terms.map(function (term) {
            return {
                title: term, 
                subTitle: '', 
                key:term,
                jumpUrl: '#/score/'+term
            };
        });
        var section = {header: {title: '学期', access: true}, rows: rows};
        console.log([section]);
        this.setState({sections: [section]});
    }
    render() {
        return (
            <Page ref="page" className="cell" title="选择学期">
                <ListView sections={this.state.sections} />
            </Page>
        );
    }

    get page() {
        return this.refs.page;
    }
};
