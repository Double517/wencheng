/**
 * Created by wujichao on 16/4/28.
 */
/*
 headerView
 section cell(可配置cell)?  先title subtitle + jumpUrl
 footerView
     */

"use strict";

import React from 'react';

import {
    Cells,
    CellsTitle,
    CellsTips,
    Cell,
    CellHeader,
    CellBody,
    CellFooter,
} from 'react-weui';

export default class ListView extends React.Component {
    constructor (props) {
        super(props);

        // this.state = { smiling: false };
        //
        // this.handleClick = () => {
        //     this.setState({smiling: !this.state.smiling});
        // };
    }

    componentWillMount () {
        // add event listeners (Flux Store, WebSocket, document, etc.)
    }

    componentDidMount () {
        // React.getDOMNode()
    }

    componentWillUnmount () {
        // remove event listeners (Flux Store, WebSocket, document, etc.)
    }

    render() {

        var section_titles = this.props.sections.map((section) => {
            return (<CellsTitle>{section.header.title}</CellsTitle>);
        });

        var section_rows = this.props.sections.map((section) => {
            var rows = [];
            for (var i = 0; i < section.rows.length; i++) {
                var item = section.rows[i];
                rows.push(<Cell>
                    <CellBody>
                        {item.title}
                    </CellBody>
                    <CellFooter>
                        {item.subTitle}
                    </CellFooter>
                </Cell>);
            }
            return (<Cells>{rows}</Cells>);
        });

        var table = [];
        for (var i = 0; i < section_titles.length; i++) {
            table.push(section_titles[i]);
            table.push(section_rows[i]);
        }
        if (table.length === 0) {
            return (null);
        } else {
            return (
                <div>
                    {table}
                </div>
            );
        }
    }
}

/*
 sections =  [
    {
        header:{title:'', ...},
        rows:[{}, {}]
    }
 ]
 */
ListView.defaultProps = {
    sections: []
};

ListView.propTypes = {
    sections: React.PropTypes.array
};
