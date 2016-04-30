/**
 * Created by jf on 15/12/10.
 */

"use strict";

import React from 'react';
import Page from '../../component/page';
import ListView from '../../component/ListView';
import {getWXCode, splitArray} from '../../util/index';

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
        $.getJSON('api/student/rewards', {code: getWXCode()}, (rewards, status) => {
            console.log(rewards);
            $.getJSON('api/student/punishment', {code: getWXCode()}, (punishment, status) => {
                console.log(punishment);

                if (rewards.code === 0 && punishment.code === 0) {

                    var rewards_list = rewards.data.list;
                    var punishment_list = punishment.data.list;

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
                } else {
                    alert(rewards);
                }
            });
        });
    }
    render() {
        return (
            <Page className="cell" title="奖惩信息">
                <ListView sections={this.state.sections} />
            </Page>
        );
    }
};
