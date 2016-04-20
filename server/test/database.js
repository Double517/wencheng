const db = require('../database');
const sql = require('mssql');
const chai = require('chai')
    , expect = chai.expect
    , should = chai.should()
    , assert = chai.assert;
const constants = require('../constants');

describe('Database', () => {
    describe('Sql', () => {
        it('should return users', function *() {
            var a = yield db.query('select * from UserRoles');
            a.should.be.a('Array');
        });
    });
    describe('Stored Procedure', () => {
        it('should return user', function *() {
            const request = yield db.request();
            request.input('userId', 'cy');
            var a = yield request.execute('Web用户登录判断_获取用户角色');
            // console.log(a);
            a.should.be.a('Array');
        });
    });
    describe('Sql with params', () => {
        it('should return users', function *() {
            var a = yield db.query('select * from UserRoles where userId=$1', ['cy']);
            a.should.be.a('Array');
        });
    });
    describe('Sql queryOne', () => {
        it('should return users', function *() {
            var a = yield db.queryOne('select * from UserRoles where userId=$1', ['cy']);
            a.should.have.property('sxh', 99);
            a.should.have.property('userId', 'cy');
        });
    });
    describe('Login', () => {
        // 0 head-teacher 班主任
        // 1 student
        // 2 teacher
        // 4 过程化管理员
        // -1 error
        function login(userid, password, returnValue) {
            return function *() {
                const request = yield db.request();
                request.input('userId', userid);
                request.input('pwd', password);
                var a = yield request.execute('Web用户登录判断');
                assert(a.returnValue == returnValue);
            }
        }
        it('should return 0', login('cy', '12345', constants.USER_TYPE_HEAD_TEACHER));
        it('should return 1', login('1417249001', '12345', constants.USER_TYPE_STUDENT));
        it('should return 2', login('cxu', '12345', constants.USER_TYPE_TEACHER));
        it('should return -1', login('1417249001', 'xxxxxxxxxx', -1));
    });
    describe('insert into wechat_bind', () => {

        const openid = 'test_openid_6';
        const userid = 'test_userid';
        const usertype = 1;

        it('should be ok', function *() {
            const request = yield db.request();
            request.input('openid', openid);
            request.input('userid', userid);
            request.input('usertype', usertype);
            var result = yield request.query('insert into wechat_bind values (@openid,@userid,@usertype)');
            assert(result === undefined);
        });
        it('should be ok', function *() {
            const request = yield db.request();
            request.input('openid', openid);
            var result = yield request.query('delete from wechat_bind where openid=@openid');
            assert(result === undefined);
        });
    });
    describe('delete all wechat_bind', () => {
        // it('should be ok', function *() {
        //     const request = yield db.request();
        //     var result = yield request.query('delete from wechat_bind');
        //     assert(result === undefined);
        // });
    });
});
