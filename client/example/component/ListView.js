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
                if (!item.key) {
                    throw new Error('必须提供唯一的key');
                }
                rows.push(<Cell href={item.jumpUrl} key={item.key}>
                    <CellBody>
                        {item.title}
                    </CellBody>
                    <CellFooter>
                        {item.subTitle}
                    </CellFooter>
                </Cell>);
            }
            return (<Cells access={!!section.header.access}>{rows}</Cells>);
        });

        var table = [];
        for (var i = 0; i < section_titles.length; i++) {
            table.push(section_titles[i]);
            table.push(section_rows[i]);
        }

        var components = [];
        if (this.props.headerView) {
            components.push(this.props.headerView)
        }
        if (table.length > 0) {
            components.push(table);
        }
        if (this.props.footerView) {
            components.push(this.props.footerView)
        }

        if (components.length === 0) {
            return (null);
        } else {
            return (
                <div>
                    {components}
                </div>
            );
        }
    }
}

/*
 sections =  [
    {
        header:{title:'', access:true ...},
        rows:[{title, subTitle, jumpUrl}, {}]
    }
 ]
 其中access只能按section配置, 不能指定单独cell
 */
ListView.defaultProps = {
    sections: []
};

ListView.propTypes = {
    sections: React.PropTypes.array,
    headerView: React.PropTypes.element,
    footerView: React.PropTypes.element,
};
