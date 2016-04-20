"use strict"

const keys = require('../config/keys');
const sql = require('mssql');
const assert = require('chai').assert;

var config = {
    user: keys.DATABASE_USER,
    password: keys.DATABASE_PASSWORD,
    server: keys.DATABASE_SERVER,
    database: keys.DATABASE_DATABASE,
    driver: 'tedious',
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

module.exports.query = query;
function* query(sqlString, params) {
    let recordsets;
    try {
        if (params) {
            // eg. VALUES ($1, $2, $3), params = ['a', 'b', 'c']
            sqlString = sqlString.replace(/\$(\d+)/g, function(match, contents, offset, s)
                {
                    const i = +contents-1;
                    if (i < 0 || i >= params.length) {
                        throw Error('index ' + i + ' beyond index, params: ' + params);
                    }
                    const param = params[i];
                    if (/(--| |\/\*|\*\/|')/.test(param)) {
                        throw new RequestError("SQL injection warning for param '" + param + "'", 'EINJECT');
                    }
                    return '\'' + param + '\'';
                }
            );
            // console.log(sqlString);
        }

        const connection = yield sql.connect(config);
        recordsets = yield new sql.Request(connection).query(sqlString);
    } catch (err) {
        throw err;
    }

    return recordsets;
}

/*
exports.insertMessage = function*(data) {
    assert(_.isInteger(data.user_id) || _.isUndefined(data.user_id));
    assert(_.isString(data.markup));
    assert(_.isString(data.ip_address));
    assert(_.isString(data.user_agent) || _.isUndefined(data.user_agent));

    const sql = `
    INSERT INTO messages (user_id, markup, ip_address, user_agent)
    VALUES ($1, $2, $3::inet, $4)
    RETURNING *
  `;

    return yield dbUtil.queryOne(sql, [
        data.user_id, data.markup, data.ip_address, data.user_agent
    ]);
};*/
module.exports.queryOne = function *(sqlString, params) {
    const records = yield query(sqlString, params);
    assert(records.length <= 1);
    if (records.length == 0) {
        return null;
    } else {
        return records[0];
    }
};

module.exports.queryWithRequst = queryWithRequst;
function *queryWithRequst(request) {
    var connection = yield sql.connect(config);
    var recordsets = yield request;
    // console.log(recordsets);
    return recordsets;
};
//
// module.exports.queryOneWithRequst = function *(request) {
//     const records = yield queryWithRequst(request);
//     assert(records.length <= 1);
//     console.log(records.returnValue);
//     if (records.length == 0) {
//         return null;
//     } else {
//         return records[0];
//     }
// };


/*************** test code ********************/

module.exports.promiseQuery = function() {
    return sql.connect(config).then(function () {
        return new sql.Request().query('select * from UserRoles');
    });
};

module.exports.test = function() {
    sql.connect(config).then(function () {

        // Query
        new sql.Request().query('select * from TestTable').then(function (recordset) {
            console.dir(recordset);
        }).catch(function (err) {
            // ... query error checks
        });

        // Stored Procedure
        // new sql.Request()
        //     .input('input_parameter', sql.Int, value)
        //     .output('output_parameter', sql.VarChar(50))
        //     .execute('procedure_name').then(function (recordsets) {
        //     console.dir(recordsets);
        // }).catch(function (err) {
        //     // ... execute error checks
        // });

        new sql.Request()
            .input('userId', 'cy')
            .execute('Web用户登录判断_获取用户角色').then(function (recordsets) {
            console.dir(recordsets);
        }).catch(function (err) {
            // ... execute error checks
            console.log(err);
        });
        // var request = new sql.Request();
        // request.verbose = true;
        // request.input('userId', 'cy'); //这里无需@userId, 无需指定类型, 具体参数可以直接看数据库
        // request.execute('Web用户登录判断_获取用户角色');//这里无需[]

    }).catch(function (err) {
        // ... connect error checks
        console.log(err);
    });
};