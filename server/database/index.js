const keys = require('../config/keys');
var sql = require('mssql');

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

/*
 SELECT TOP 1000 [sxh]
 ,[userId]
 ,[RoleID]
 FROM [D0317].[dbo].[UserRoles]
* */
module.exports.thunk = function() {
    return sql.connect(config).then(function (connection) {
        return new sql.Request(connection).query('select * from UserRoles');
    });
};
module.exports.thunk2 = function() {
    return sql.connect(config).then(function () {
        return new sql.Request().query('select * from UserRoles');
    });
};