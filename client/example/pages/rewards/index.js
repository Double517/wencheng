/**
 * Created by jf on 15/12/10.
 */

"use strict";

import React from 'react';
import Page from '../../component/page';
import ListView from '../../component/ListView';

import Ajax from '../../util/ajax';

export default class Rewards extends React.Component {
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

        var rewards_request = Ajax.get('api/student/rewards');
        var punishment_request = Ajax.get('api/student/punishment');
        Promise.all([rewards_request, punishment_request])
            .then((result) => {
                var rewards_list = result[0].list;
                var punishment_list = result[1].list;

                var rewards_items = rewards_list.map((row) => {
                    return {
                        title: row['科目名称'],
                        subTitle: '',
                        jumpUrl: '#/rewards/detail/' + encodeURIComponent(JSON.stringify(row)),
                        key:row['科目名称'] + row['奖励时间']
                    };
                });
                var punishment_items = punishment_list.map((row) => {
                    return {
                        title: row['处分名称'],
                        subTitle: '',
                        jumpUrl: '#/rewards/detail/' + encodeURIComponent(JSON.stringify(row)),
                        key:row['处分名称'] + row['处分时间']
                    };
                });

                var rewards_section = {header: {title: '奖励', access: true}, rows: rewards_items};
                var punishment_section = {header: {title: '处分', access: true}, rows: punishment_items};

                if (rewards_list.length === 0) {
                    rewards_section.header.access = false;
                    rewards_section.rows = [{title: '无', subTitle:'', key:'rewards_empty_row'}];
                }
                if (punishment_list.length === 0) {
                    punishment_section.header.access = false;
                    punishment_section.rows = [{title: '无', subTitle:'', key:'punishment_empty_row'}];
                }

                var sections = [rewards_section, punishment_section];
                console.log(sections);

                this.setState({sections: sections});
            })
            .catch((err) => {
                console.log(err);
                this.page.showAlert(err.msg);
            });
    }
    render() {
        return (
            <Page ref="page" className="cell" title="奖惩信息">
                <ListView sections={this.state.sections} />
            </Page>
        );
    }

    get page() {
        return this.refs.page;
    }
};
