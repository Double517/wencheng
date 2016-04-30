/**
 * Created by jf on 15/12/10.
 */

"use strict";

import React from 'react';
import Page from '../../component/page';
import ListView from '../../component/ListView';
import {getWXCode, splitArray} from '../../util/index';
const moment = require('moment');

export default class CetScore extends React.Component {
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
        $.getJSON('api/student/score/cet', {code: getWXCode()}, (data, status) => {
            console.log(data);
            if (status === 'success' && data.code === 0) {

                var rows = data.data.list.map(function(object) {
                    var title = object.ksjc + ': ' + object.cj;
                    var subTitle = moment(object.kssj).format('YYYY-MM-DD');
                    return {title, subTitle};
                });
                var section = {header: {title: ''}, rows: rows};
                console.log(section);

                this.setState({sections: [section]});
            } else {
                alert(data);
            }
        });
    }
    render() {
        return (
            <Page className="cell" title="四六级成绩">
                <ListView sections={this.state.sections} />
            </Page>
        );
    }
};
