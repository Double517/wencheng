var moment = require('moment');

//计算目前是教学第几周
module.exports.get_current_week = function (start_day, now)
{
    var start = moment(start_day);
    now = now ? moment(now) : moment();

    return _get_current_week(start, now);
};

//复制原网站代码 computezc(DateTime st,DateTime et)
function _get_current_week(start, now)
{
    if (+start >= +now) return 1;

    var day = now.diff(start, "days"); //et st 相差的天数

    var zc = 0;

    var sd = start.day();//星期天返回0，其余1－6.，我认为星期天是新的一周
    var ed = now.day();

    if (day < 7 && (sd - ed) < 0) //在同一周，不跨周
    {
        zc = 1;
    }

    if (day<7 && (sd-ed)>=0)  //在同一周，跨周
    {
        zc=2;
    }

    var sspan = 7 - sd;

    //算去头掐尾巴的整数周次
    if (day >= 7)
    {
        zc = (day - sspan - ed) / 7;
        if (sspan>0) zc++;
        if (ed>=0) zc++;
    }

    if (zc <= 0) zc = 1;
    else if (zc > 18) zc = 18;
    return zc;
}