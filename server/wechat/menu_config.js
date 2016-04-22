const constants = require('../constants');

const keys = module.exports.keys = {
    i_am_student: 'i_am_student',
    i_am_head_teacher: 'i_am_head_teacher',
    today_class_schedule: 'today_class_schedule',
    unbind: 'unbind'
};

/*
module.exports.default_menu = {
    "button":[
        {
            "type":"click",
            "name":"我是学生",
            "key":keys.i_am_student
        },
        {
            "type":"click",
            "name":"我是老师",
            "key":keys.i_am_head_teacher
        }
    ]
};
*/
/*
 课表  (一键查今日课表)
 成绩查询 {4学期成绩 5四六级成绩}
 更多 {6考试安排 1奖惩信息 2行为学分 7解绑}
 */
module.exports.default_menu = 
module.exports.student_menu = {
    "button":[
        {
            "type":"click",
            "name":"今日课表",
            "key":keys.today_class_schedule
        },
        {
            "name":"成绩查询",
            "sub_button":[
                {
                    "type":"view",
                    "name":"学期成绩",
                    "url":"http://www.soso.com/"
                },
                {
                    "type":"view",
                    "name":"四六级成绩",
                    "url":"http://www.soso.com/"
                }]
        },
        {
            "name":"更多",
            "sub_button":[
                {
                    "type":"view",
                    "name":"考试安排",
                    "url":"http://www.soso.com/"
                },
                {
                    "type":"view",
                    "name":"奖惩信息",
                    "url":"http://www.soso.com/"
                },
                {
                    "type":"view",
                    "name":"行为学分",
                    "url":"http://www.soso.com/"
                },
                {
                    "type":"click",
                    "name":"解绑",
                    "key":keys.unbind
                }]
        }
    ],
    "matchrule":{
        "group_id":constants.USER_TYPE_STUDENT_GROUP_ID
    }
};

/*
 学生/班级 {1查询学生} {2班级学生名单} 6奖学金排名 78成绩排名
 奖惩/异动  {4奖励一览 5处分一览} 9行为学分 {3班级异动}
 更多
    课程/考试 {10本班开课课表 11本班开课课程 12班级考试安排一览}
    解除绑定
 */
module.exports.head_teacher_menu = {
    "button":[
        {
            "name":"学生/成绩",
            "sub_button":[
                {
                    "type":"view",
                    "name":"查询学生",
                    "url":"http://www.soso.com/"
                },
                {
                    "type":"view",
                    "name":"班级学生名单",
                    "url":"http://www.soso.com/"
                },
                {
                    "type":"view",
                    "name":"奖学金排名",
                    "url":"http://www.soso.com/"
                },
                {
                    "type":"view",
                    "name":"成绩排名",
                    "url":"http://www.soso.com/"
                }]
        },
        {
            "name":"奖惩/异动",
            "sub_button":[
                {
                    "type":"view",
                    "name":"奖励一览",
                    "url":"http://www.soso.com/"
                },
                {
                    "type":"view",
                    "name":"处分一览",
                    "url":"http://www.soso.com/"
                },
                {
                    "type":"view",
                    "name":"行为学分",
                    "url":"http://www.soso.com/"
                },
                {
                    "type":"view",
                    "name":"班级异动",
                    "url":"http://www.soso.com/"
                }]
        },
        {
            "name":"更多",
            "sub_button":[
                {
                    "type":"view",
                    "name":"本班开课课表",
                    "url":"http://www.soso.com/"
                },
                {
                    "type":"view",
                    "name":"本班开课课程",
                    "url":"http://www.soso.com/"
                },
                {
                    "type":"view",
                    "name":"班级考试安排",
                    "url":"http://www.soso.com/"
                },
                {
                    "type":"click",
                    "name":"解绑",
                    "key":keys.unbind
                }]
        }],
    "matchrule":{
        "group_id":constants.USER_TYPE_HEAD_TEACHER_GROUP_ID
    }
};
