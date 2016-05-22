import auth from '../util/auth.js';

// 登录就直接转到url
// 未登录就先登录, 登录有转到url
function redirectToLogin(nextState, replace) {
    if (!auth.loggedIn()) {

        replace({
            pathname: '/wechat_oauth',
            state: {nextPathname: nextState.location.pathname}
        });

        // if (wx_helper.isWeixinBrowser()) {
        // replace({
        //     pathname: '/wechat_oauth',
        //     state: {nextPathname: nextState.location.pathname}
        // });
        // } else {
        //     replace({
        //         pathname: '/login',
        //         state: {nextPathname: nextState.location.pathname}
        //     })
        // }
    }
}

// 登录成功跳转到dashboard
function redirectToDashboard(nextState, replace) {
    if (auth.loggedIn()) {
        replace('/')
    }
}

const publicRoutes = [
    {
        path: '/logout',
        component: require('../pages/app/Logout')
    },
    {
        // for test
        path: '/about',
        component: require('../pages/app/About')
    },
    {
        // for test
        path: '/user/:id',
        component: require('../pages/app/User')
    },
    {
        path: '/redirect',
        component: require('../pages/WechatRedirect')
    },
    {
        path: '/wechat_oauth',
        component: require('../pages/WechatOAuth')
    },
    {
        // 虽是public但是依赖openid, 所以使用 `/wechat_oauth?target=/bind`调用
        path: '/bind',
        component: require('../pages/bind')
    },
    {
        // 虽是public但是依赖openid, 所以使用 `/wechat_oauth?target=/unbind`调用
        path: '/unbind',
        component: require('../pages/bind/unbind')
    }
];

const login = {
    onEnter: redirectToDashboard,
    childRoutes: [
        // Unauthenticated routes
        // Redirect to dashboard if user is already logged in
        {
            path: '/login',
            component: require('../pages/app/Login')
        }
        // ...
    ]
};

const studentRoutes = {
    onEnter: redirectToLogin,
    childRoutes: [
        {
            path: '/example',
            component: require('../pages/home/index')
        },
        {
            path: '/class_schedule',
            component: require('../pages/class_schedule/index')
        },
        {
            path: '/score(/:filter)',
            component: require('../pages/score/index')
        },
        {
            path: '/score/select/:data',
            component: require('../pages/score/select')
        },
        {
            path: '/score/detail/:data',
            component: require('../pages/score/detail')
        },
        {
            path: '/cet',
            component: require('../pages/score/cet')
        },
        {
            path: '/exam/schedule',
            component: require('../pages/exam/schedule/index')
        },
        {
            path: '/exam/schedule/detail/:data',
            component: require('../pages/exam/schedule/detail')
        },
        {
            path: '/behavior',
            component: require('../pages/behavior/index')
        },
        {
            path: '/behavior/detail/:data',
            component: require('../pages/behavior/detail')
        },
        {
            path: '/rewards',
            component: require('../pages/rewards/index')
        },
        {
            path: '/rewards/detail/:data',
            component: require('../pages/rewards/detail')
        }
    ]
};

const teacherRoutes = {
    onEnter: redirectToLogin,
    childRoutes: []
};

const app = {
    path: '/',
    component: auth.loggedIn() ?
        require('../pages/app/Dashboard') :
        require('../pages/app/Landing'),
    indexRoute: {
        component: require('../pages/app/PageOne')
    },
    childRoutes: [
        {
            onEnter: redirectToLogin,
            childRoutes: [
                // Protected nested routes for the dashboard
                {
                    path: '/page2',
                    // getComponent 按需载入component
                    getComponent: (nextState, cb) => {
                        require.ensure([], (require) => {
                            cb(null, require('../pages/app/PageTwo'))
                        })
                    }
                }
                // ...
            ]
        }
    ]
};

export default {
  component: require('../pages/app/App'),
  childRoutes: [].concat(publicRoutes, login, studentRoutes, teacherRoutes, app)
}
