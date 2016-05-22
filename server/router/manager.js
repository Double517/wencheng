// 3st
const Router = require('koa-router');

// 1st
const db = require('../database');
const apiError = require('../api/error');
const api = require('../api');

// router
const router = new Router({
    prefix: '/api/manager'
});

// exports
module.exports = router;

// manager
//
const wechat_api = require('../wechat_robot').wechat_api;
router.get('/manager/user/list', function *(next) {
    const result = yield wechat_api.getFollowers();
    const openid_list = result.data.openid;
    const total = result.total;
    const count = result.count;
    //const next_openid = result.next_openid;
    console.log(result);

    const user_info_result = yield wechat_api.batchGetUsers(openid_list);
    const user_list = user_info_result['user_info_list'];
    for (var i = 0; i < user_list.length; i++) {
        var user = user_list[i];
        const request = yield db.request();
        request.input('openid', user.openid);
        const r = yield request.queryOne('select userid from wechat_bind where openid=@openid');
        if (r) {
            user.userid = r.userid;
        }
    }

    console.log(user_list);
    this.body = api.returnList(user_list);
});

router.get('/manager/group/list', function *(next) {
    const result = yield wechat_api.getGroups();
    console.log(result);
    this.body = api.returnList(result.groups);
});

router.post('/manager/group/move', function *(next) {
    const openid_list = this.request.body.openid_list;
    const to_groupid = this.request.body.to_groupid;
    console.log({openid_list, to_groupid});
    try {
        // var result = null;
        // for (var i = 0; i < openid_list.length; i++) {
        //     var openid = openid_list[i];
        //     result = yield wechat_api.moveUserToGroup(openid, to_groupid);
        //     console.log(result);
        // }
        const result = yield wechat_api.moveUsersToGroup(openid_list, to_groupid);
        console.log(result);
        this.body = api.success();
    } catch (e) {
        console.log(e);
        this.body = api.return(apiError.server_error);
    }
});

router.post('/manager/group/add', function *(next) {
    const group_name = this.request.body.group_name;
    console.log({group_name});
    try {
        var result = yield wechat_api.createGroup(group_name);
        this.body = api.success();
    } catch (e) {
        console.log(e);
        this.body = api.return(apiError.server_error);
    }
});

router.post('/manager/group/remove', function *(next) {
    const group_id = this.request.body.group_id;
    console.log({group_id});
    try {
        var result = yield wechat_api.removeGroup(group_id);
        this.body = api.success();
    } catch (e) {
        console.log(e);
        this.body = api.return(apiError.server_error);
    }
});

router.get('/manager/menu/all', function *(next) {
    const result = yield wechat_api.getMenu();
    console.log(result);
    //{menu:{}, conditionalmenu:[{},{}]}
    this.body = api.return(result);
});

router.post('/manager/menu/update', function *(next) {
    const config = this.request.body.config;
    console.log(config);
    var result = null;
    try {
        result = yield* wechat_api.removeMenu();
        console.log(result);

        result = yield* wechat_api.createMenu(config.menu);
        console.log(result);

        if (config.conditionalmenu && config.conditionalmenu.length > 0) {
            for (var i = 0; i < config.conditionalmenu.length; i++) {
                var c = config.conditionalmenu[i];
                result = yield* wechat_api.addConditionalMenu(c);
                console.log(result);
            }
        }

        this.body = api.success();
    } catch (e) {
        console.log(e);
        this.body = api.return(apiError.server_error);
    }
});
