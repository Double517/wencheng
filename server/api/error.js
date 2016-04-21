// 通用
module.exports.success = {code:0, msg:null};

module.exports.parameter_invalid = {code:20, msg:'parameter_invalid'};
module.exports.parameter_missing = {code:21, msg:'parameter_missing'};
module.exports.password_error = {code:22, msg:'password_error'};

// http
//2xx
module.exports.ok = {code:200, msg:'OK'};
module.exports.created = {code:201, msg:'Created'};
//3xx
module.exports.not_modified = {code:304, msg:'Not Modified'};
//4xx
module.exports.bad_request = {code:400, msg:'Bad Request'};
module.exports.unauthorized = {code:401, msg:'Unauthorized'};
module.exports.forbidden = {code:403, msg:'Forbidden'};
module.exports.not_found = {code:404, msg:'Not Found'};
//5xx
module.exports.server_error = {code:500, msg:'Internal Server Error'};


// 业务错误
//
module.exports.student_not_exist = {code:10001, msg:'student_not_exist'};
module.exports.error = function (code, msg) {
    return {code: code, msg: msg};
};