/**
 * Created by jf on 15/12/10.
 */

"use strict";

import React from 'react';
import ListView from '../../component/ListView'

export default class Panel extends React.Component {
    render() {
        const sections = [
            {
                header:{title:'', access:true},
                rows:[
                    {title:'课表', key:'课表', subtitle:'查看课表', jumpUrl:'#class_schedule'},
                    {title:'成绩', key:'成绩', subtitle:'查看学期成绩', jumpUrl:'#score'},
                    {title:'四六级成绩', key:'四六级成绩', subtitle:'查看四六级成绩', jumpUrl:'#cet'},
                    {title:'考试安排', key:'考试安排', subtitle:'查看考试安排', jumpUrl:'#exam/schedule'},
                    {title:'行为学分', key:'行为学分', subtitle:'查看行为学分', jumpUrl:'#behavior'},
                    {title:'奖惩', key:'奖惩', subtitle:'查看奖惩信息', jumpUrl:'#rewards'}
                ]
            }
        ];
        return (
            <div>
                <ListView sections={sections} />
            </div>
        );
    }
};
