const db = require('../database');
const chai = require('chai')
    , expect = chai.expect
    , should = chai.should()
    , assert = chai.assert;

const keys = require('../config/keys');
const wechat_api = require('../wechat').wechat_api;
const constants = require('../constants');

describe('group', () => {
    describe('create group', () => {
        // it('should be ok', function *() {
        //     yield wechat_api.removeGroup(103);
        //     yield wechat_api.removeGroup(104);
        //     yield wechat_api.removeGroup(105);
        //     yield wechat_api.removeGroup(106);
        //     yield wechat_api.removeGroup(107);
        //     yield wechat_api.removeGroup(108);
        // });
        function createGroup(name, usertype) {
            return function *() {
                var result = yield wechat_api.createGroup(name);
                console.log(result);
                assert(result.group.name === name);

                const request = yield db.request();
                request.input('usertype', usertype);
                request.input('groupid', result.group.id);
                const r = yield request.query('insert into wechat_group values (@usertype,@groupid)');

                assert(r === undefined);
            }
        }
        // it('should be ok', createGroup('student', constants.USER_TYPE_STUDENT));
        // it('should be ok', createGroup('teacher', constants.USER_TYPE_TEACHER));
        // it('should be ok', createGroup('head-teacher', constants.USER_TYPE_HEAD_TEACHER));
    });
    describe('get group', () => {
        it('should be ok', function *() {
            var result = yield wechat_api.getGroups();
            console.log(result);
            assert(result.groups.length > 0);
        });
    });
});
