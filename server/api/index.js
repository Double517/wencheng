
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

module.exports.wechat = require('./wechat');