'use strict';

exports.NODE_ENV = process.env.NODE_ENV || 'development';

// 需同时修改: 微信公众平台后台修改三个地方 1 接口配置信息 2 JS接口安全域名 3 网页授权获取用户基本信息
exports.HOST_DOMAIN = 'wencheng.ngrok.natapp.cn';

// Output config object in development to help with sanity-checking
if (exports.NODE_ENV === 'development' || exports.NODE_ENV === 'test') {
    console.log(exports);
}