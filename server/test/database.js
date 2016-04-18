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
});
