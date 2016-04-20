/**
 * Created by wujichao on 16/4/19.
 */
const request = require('request');

module.exports = function (url) {
    return function (fn) {
        request(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                // console.log(body);
                fn(null, JSON.parse(body));
            } else {
                fn(error, null);
            }
        });
    }
};