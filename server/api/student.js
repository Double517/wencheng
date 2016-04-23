const db = require('../database');
const moment = require('moment');
const _ = require('lodash');
const util = require('../api/util');


/*
参数1 string userid: 学号
参数2 int week: 周 [1,18]
输出 array
 kcmc 课程名称
 skxq 星期
 qsjc 起始节
 jsjc 结束节
 zxz 0所有周 1单周 2双周
 ksz 开始周 不需要
 jsz 结束周 不要要
 jsdm 编号
 */
const get_class_schedule =
module.exports.get_class_schedule = function *(userid, week)
{
    const term_result = yield db.queryOne('select dqxq from systemconfig');

    const request = yield db.request();
    request.input('xqbs', term_result.dqxq); //当前学期
    request.input('xh', userid); //学号
    request.input('zc', week); //当前周
    const result = yield request.execute('web_xs_coursetable');

    console.log(result);

    return {week: week, list: result[0]};
};

const get_this_week_class_schedule =
module.exports.get_this_week_class_schedule = function *(userid)
{
    console.log(userid);

    // 获取起始周
    const start_data = yield db.queryOne('select dqxqqszdate from webglbasicdata');
    // 计算当前周
    const current_week = util.get_current_week(start_data.dqxqqszdate);

    return yield get_class_schedule(userid, current_week);
};

module.exports.get_today_class_schedule = function *(userid)
{
    const result = yield get_this_week_class_schedule(userid);
    const day = moment().day();

    var r = [];
    _(result.list).forEach(function(item) {
        if (item.skxq == day) {
            r.push(item);
        }
    });
    return {day: day, list: r};
};

module.exports.get_score = function *(userid)
{
    const request = yield db.request();
    request.input('userid', userid);

    // 从xscjxx.aspx private void dgptkcbindsy(string sort)复制
    // 去掉了sort
    var xhstr = "@userid";
    var sql = "select kcjc=case f.xwkc when '1' then b.kcjc+'(**)' else b.kcjc end ,a.cj, c.xxxzmc, d.ksxzmc, e.cjxzmc, a.yxxq, a.xf, a.xqbs,a.xfjd ,f.xwkc,bz=case ischongxiu when 1 then '重新学习' else ' ' end ";
    sql = sql + " from xscjb as a, kcxxb as b, xxxzb as c , ksxzb as d, cjxzb as e ,jxjhb as f,xsb as g";
    sql = sql + " where a.jh_kcdm = b.kcdm and a.xxxzdm = c.xxxzdm and a.ksxzdm = d.ksxzdm ";
    // sql = sql + " and a.cjxzdm = e.cjxzdm and a.xh ='" + xhstr + "' and ((a.cj is not null and a.cjxzdm='1') or (a.cj is null and a.cjxzdm<>'1'))  ";
    sql = sql + " and a.cjxzdm = e.cjxzdm and a.xh =" + xhstr + " and ((a.cj is not null and a.cjxzdm='1') or (a.cjxzdm<>'1'))  ";
    sql = sql + " and a.xh=g.xh and g.zxjhnf=f.rxsj and g.zydm=f.zydm and f.kcdm=a.jh_kcdm ";
    sql = sql + " union  ";
    sql = sql + " select  b.kcjc as kcjc,a.cj, c.xxxzmc, d.ksxzmc, e.cjxzmc, a.yxxq, a.xf, a.xqbs,a.xfjd ,0 as xwkc,bz=case ischongxiu when 1 then '重新学习' else ' ' end";
    sql = sql + " from xscjb as a, kcxxb as b, xxxzb as c , ksxzb as d, cjxzb as e ";
    sql = sql + " where a.jh_kcdm = b.kcdm and a.xxxzdm = c.xxxzdm and a.ksxzdm = d.ksxzdm ";
    //sql = sql + " and a.cjxzdm = e.cjxzdm and a.xh ='" + xhstr + "' and ((a.cj is not null and a.cjxzdm='1') or (a.cj is null and a.cjxzdm<>'1'))  ";
    sql = sql + " and a.cjxzdm = e.cjxzdm and a.xh =" + xhstr + " and ((a.cj is not null and a.cjxzdm='1') or (a.cjxzdm<>'1'))  ";
    sql = sql + " and  a.jh_kcdm not in ( select distinct  kcdm from jxjhb as f, xsb as g where g.xh =" + xhstr + " and ";
    sql = sql + " g.zydm = f.zydm and g.zxjhnf = f.rxsj )   ";
    //sql = sql + " order by "+sort;

    const result = yield request.query(sql);
    return result;
};

module.exports.get_score_cet = function *(userid)
{
    const request = yield db.request();
    request.input('userid', userid);

    // 从xscjxx.aspx private void dgqtkcbind(string sort)复制
    // 去掉了sort
    var sqlstr = "select a.cj,a.kssj,a.xqbs,b.ksjc,dd=case dd when 0 then '不合格' when 1 then '合格' when 2 then '优秀' end  from dj_cj_new as a left join qtksxmb as b ";
    sqlstr += "on a.ksxmdm=b.ksxmdm  where xh=@userid";

    const result = yield request.query(sqlstr);
    return result;
};

module.exports.get_exam_schedule = function *(userid)
{
    const request = yield db.request();
    request.input('userid', userid);
    // xsksap.aspx private void dgbind(string sort)
    const result = yield request.query("select sj,dd,km,xxxz,bz from F_xsksap(@userid)");

    return result;
};

module.exports.get_behavior = function *(userid)
{
    // xwxf_detail.aspx

    const r1 = yield db.request();
    r1.input('userid', userid);
    const total = yield r1.queryOne("select xwxf from v_行为学分_汇总表 where xh=@userid");

    const r2 = yield db.request();
    r2.input('userid', userid);
    const list = yield r2.query("select xh 学号, XM 姓名, xqbs 学期, bhvName 行为名称 , fs 分数, Memo 备注, CreateDate 录入日期 from v_行为学分_学生行为列表 where xh=@userid order by xqbs");

    const result = {total: total.xwxf, list: list};
    return result;
};
