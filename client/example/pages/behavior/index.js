/**
 * Created by jf on 15/12/10.
 */

"use strict";

import React from 'react';
import Page from '../../component/page';
import ListView from '../../component/ListView';
import Ajax from '../../util/ajax';

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
        Ajax.get('api/student/behavior')
            .then((data) => {
                var list = data.list;
                var items = list.map((row) => {
                    return {
                        title: row['行为名称'],
                        subTitle: '',
                        jumpUrl: '#/behavior/detail/' + encodeURIComponent(JSON.stringify(row)),
                        key: row['行为名称']+row['录入日期']/*行为名称+录入日期*/
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
            <Page ref="page" className="cell" title="行为学分">
                <ListView sections={this.state.sections} />
            </Page>
        );
    }

    get page() {
        return this.refs.page;
    }
};
