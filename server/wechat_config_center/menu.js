/**
 * Created by wujichao on 16/4/21.
 */

const db = require('../database');
const chai = require('chai')
    , expect = chai.expect
    , should = chai.should()
    , assert = chai.assert;

const keys = require('../config/keys');
const wechat_api = require('../wechat_robot').wechat_api;
const constants = require('../constants');
const menu_config = require('./menu_config');

describe('menu', () => {
    describe('delete all menu', () => {
        it('should be ok', function *() {
            //在个性化菜单时，调用此接口会删除默认菜单及全部个性化菜单。
            var result = yield* wechat_api.removeMenu();
            console.log(result);
            assert(result.errcode == 0);
        });
    });
    describe('show all menu', () => {
        it('just show', function *() {
            var result = yield* wechat_api.getMenu();
            console.log(result);
        });
    });
    describe('create menu', () => {
        it('should be ok', function *() {
            var result = yield* wechat_api.createMenu(menu_config.default_menu);
            console.log(result);
            assert(result.errcode == 0);
        });
    });
    describe('create custom menu', () => {
        it('should be ok', function *() {
            var result = yield* wechat_api.addConditionalMenu(menu_config.head_teacher_menu);
            console.log(result);
            assert(result.menuid != 0);

            var result2 = yield* wechat_api.addConditionalMenu(menu_config.student_menu);
            console.log(result2);
            assert(result2.menuid != 0);
        });
    });
    describe('test custom menu', () => {
        it('should be ok', function *() {
            var openid = 'ojb3hv0i_WXXU9QFpRDUCuzJbJDc';
            var g = yield wechat_api.getWhichGroup(openid);
            console.log(g);

            var m = yield wechat_api.moveUserToGroup(openid, constants.USER_TYPE_HEAD_TEACHER_GROUP_ID);
            console.log(m);

            var g = yield wechat_api.getWhichGroup(openid);
            console.log(g);

            var result = yield* wechat_api.tryConditionalMenu(openid);
            console.log(JSON.stringify(result, null, 4));
            assert(result.menu.button.length > 0);
        });
    });
    describe('show all menu', () => {
        it('should be ok', function *() {
            var result = yield* wechat_api.getMenu();
            console.log(JSON.stringify(result, null, 4));
            assert(result.menu.button.length > 0);
        });
    });
});
