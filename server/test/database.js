const db = require('../database');
const sql = require('mssql');
const chai = require('chai')
    , expect = chai.expect
    , should = chai.should()
    , assert = chai.assert;

describe('Database', () => {
    describe('Sql', () => {
        it('should return users', function *() {
            var a = yield db.query('select * from UserRoles');
            a.should.be.a('Array');
        });
    });
    describe('Stored Procedure', () => {
        it('should return user', function *() {
            var request = new sql.Request()
                .input('userId', 'cy')
                .execute('Web用户登录判断_获取用户角色');
            var a = yield db.queryWithRequst(request);
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
                var request = new sql.Request()
                    .input('userId', userid)
                    .input('pwd', password)
                    .execute('Web用户登录判断');
                var a = yield db.queryWithRequst(request);
                assert(a.returnValue == returnValue);
            }
        }
        it('should return 0', login('cy', '12345', 0));
        it('should return 1', login('1417249001', '12345', 1));
        it('should return 2', login('cxu', '12345', 2));
        it('should return -1', login('1417249001', 'xxxxxxxxxx', -1));
    });
});
