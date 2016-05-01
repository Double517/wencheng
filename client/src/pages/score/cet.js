/**
 * Created by jf on 15/12/10.
 */

"use strict";

import React from 'react';
import Page from '../../component/page';
import ListView from '../../component/ListView';

const moment = require('moment');
import Ajax from '../../util/ajax';

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
        Ajax.get('api/student/score/cet')
            .then((data) => {
                var rows = data.list.map(function(object) {
                    var title = object.ksjc + ': ' + object.cj;
                    var subTitle = moment(object.kssj).format('YYYY-MM-DD');
                    return {
                        title,
                        subTitle,
                        key:object.kssj/*考试时间*/
                    };
                });
                var section = {header: {title: ''}, rows: rows};
                console.log(section);

                this.setState({sections: [section]});
            })
            .catch((err) => {
                this.page.showAlert(err.msg);
            });
    }
    render() {
        return (
            <Page ref="page" className="cell" title="四六级成绩">
                <ListView sections={this.state.sections} />
            </Page>
        );
    }

    get page() {
        return this.refs.page;
    }
};
