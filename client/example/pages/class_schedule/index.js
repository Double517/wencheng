/**
 * Created by jf on 15/12/10.
 */

"use strict";

import React from 'react';
import { ButtonArea,
    Button,
    Cells,
    CellsTitle,
    CellsTips,
    Cell,
    CellHeader,
    CellBody,
    CellFooter,
    Form,
    FormCell,
    Icon,
    Input,
    Label,
} from 'react-weui';

import Page from '../../component/page';
import {getWXCode} from '../../util/index';

export default class ClassSchedule extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sections: [],
        };
    }
    componentDidMount() {
        $.getJSON('api/student/class_schedule', {code: getWXCode()}, (data, status) => {
            console.log(data);
            if (status === 'success' && data.code === 0) {
                /*
                 { kcmc: '科技英语（G）',
                 skxq: 5,
                 qsjc: 3,
                 jsjc: 4,
                 zxz: 0,
                 ksz: 1,
                 jsz: 18,
                 jsdm: 'GS301               ' } ],
                 */
                var sections = [];
                var list = data.data.list;
                for (var i=0; i < list.length; i++) {
                    var item = list[i];
                    var rows = sections[item.skxq];
                    if (!rows) {
                        rows = [];
                        sections[item.skxq] = rows;
                    }
                    rows.push(item);
                }
                console.log(sections);
                this.setState({sections: sections});
            } else {
                alert(data);
            }
        });
    }
    render() {

        var cnChars = ['零','一','二','三','四','五','六','七','八','九'];
        var section_titles = this.state.sections.map((section) => {
            return (<CellsTitle>{'星期'+cnChars[section[0].skxq]}</CellsTitle>);
        });

        var section_rows = this.state.sections.map((section) => {
            var rows = [];
            for (var i = 0; i < section.length; i++) {
                var item = section[i];

                var title = '';
                if (item.jsjc > item.qsjc) {
                    title = '第'+item.qsjc+'-'+item.jsjc+'节';
                } else {
                    title = '第'+item.qsjc+'节';
                }
                rows.push(<Cell>
                    <CellBody>
                        {title}
                    </CellBody>
                    <CellFooter>
                        {item.kcmc}
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

        return (
            <Page className="cell" title="课表">
                {table}
            </Page>
        );
    }
};
