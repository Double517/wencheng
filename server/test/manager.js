/*global describe, it*/
'use strict';
const superagent = require('supertest');
const app = require('../app');
const request = superagent(app.listen());

describe('Routes', () => {
    describe('Manger', () => {
        it('should return 200', done => {
            request
                .get('/api/manager/user/list')
                .expect(200, done);
        });
        it('should return 200', done => {
            request
                .get('/api/manager/group/list')
                .expect(200, done);
        });
        it('should return 200', done => {
            request
                .post('/api/manager/group/move')
                .send({openid_list:['ojb3hvxmeDi0ElhGUq2BbPdok-0E'], to_groupid:'100'})
                .expect(200, done);
        });
        // it('should return 200', done => {
        //     request
        //         .post('/api/manager/group/add')
        //         .send({group_name:'111'})
        //         .expect(200)
        //         .end(function(err, res) {
        //             if (err) return done(err);
        //             done();
        // 接口竟然不返回groupid, 我都没法去删除
        //         });
        // });
    });
});
