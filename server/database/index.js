var sql = require('mssql');

var config = {
    user: 'sa',
    password: 'Uiop_098Mn',
    server: '172.16.167.128',
    database: 'Test',
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

        // // Stored Procedure
        // new sql.Request()
        //     .input('input_parameter', sql.Int, value)
        //     .output('output_parameter', sql.VarChar(50))
        //     .execute('procedure_name').then(function (recordsets) {
        //     console.dir(recordsets);
        // }).catch(function (err) {
        //     // ... execute error checks
        // });

    }).catch(function (err) {
        // ... connect error checks
        console.log(err);
    });
};



