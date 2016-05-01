
import $ from 'webpack-zepto';

export default class Ajax {

    static get(url, params) {
        params = Object.assign(this.commonParams(), params);
        console.log(`---> get:${url}, params:${JSON.stringify(params, null, 4)}`);
        var promise = new Promise(function(resolve, reject) {
            $.ajax({
                type: 'GET',
                url: url,
                // data to be added to query string:
                data: params,
                // type of data we are expecting in return:
                dataType: 'json',
                success: function(data) {
                    if (data.code === 0) {
                        console.log(`<--- get:${url}, suceess:${JSON.stringify(data.data, null, 4)}`);
                        resolve(data.data);
                    } else {
                        console.log(`<--- get:${url}, fail:${JSON.stringify(data, null, 4)}`);
                        reject({code:data.code, msg: data.msg});
                    }
                },
                // type: "timeout", "error", "abort", "parsererror"
                error: function(xhr, type) {
                    console.log(`<--- get:${url}, fail:${type}`);
                    reject({code:-1, msg: `网络错误(${type})`});
                }
            });
        });

        return promise;
    }

    static post(url, data) {
        data = Object.assign(this.commonParams(), data);
        console.log(`---> post:${url}, data:${JSON.stringify(data, null, 4)}`);
        var promise = new Promise(function(resolve, reject) {
            $.ajax({
                type: 'POST',
                url: url,
                data: JSON.stringify(data),
                contentType: 'application/json',
                success: function(data) {
                    if (data.code === 0) {
                        console.log(`<--- post:${url}, suceess:${JSON.stringify(data.data, null, 4)}`);
                        resolve(data.data);
                    } else {
                        console.log(`<--- post:${url}, fail:${JSON.stringify(data, null, 4)}`);
                        reject({code:data.code, msg: data.msg});
                    }
                },
                // type: "timeout", "error", "abort", "parsererror"
                error: function(xhr, type) {
                    console.log(`<--- post:${url}, fail:${type}`);
                    reject({code:-1, msg: `网络错误(${type})`});
                }
            });
        });

        return promise;
    }

    static commonParams() {
        var params = {};

        // 注入wxcode
        var code = getParameterByName('code');
        if (code) {
            params.code = code;
        }

        return params;
    }
};

function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.hash);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}
