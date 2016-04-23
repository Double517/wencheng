
module.exports.return = function (data) {
    if (data.code && data.code !== 0) {
        const error = data;
        return {code:error.code, msg:error.msg};
    } else {
        return {code:0, data: data};
    }
};

module.exports.success = function () {
    return {code:0};
};

module.exports.returnList = function (list) {
    return module.exports.return({list: list});
};

module.exports.example = require('./messages');
module.exports.wechat = require('./wechat');
module.exports.student = require('./student');
module.exports.teacher = require('./teacher');

// 临时page
module.exports.page = require('./page');
