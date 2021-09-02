
// 路由懒加载
const getComponent = (name: string, component: string) => () => import(`../views/${name}/${component}.vue`);

// 路由
const router = [
    {
        path: '/',
        redirect: '/login',
        component: getComponent("login", "index")
    },
    {
        path: '/login',
        name: 'login',
        component: getComponent("login", "index")
    },
    {
        path: '/home',
        name: 'layout',
        component: getComponent("layout", "index"),
        children: [
            {
                path: '/home',
                name: 'home',
                component: getComponent("home", "index")
            },
            {
                path: '/userList',
                name: 'userList',
                component: getComponent("user", "List")
            },
            {
                path: '/userType',
                name: 'userType',
                component: getComponent("user", "Types")
            },
            {
                path: '/articleList',
                name: 'articleList',
                component: getComponent("home", "index")
            },
            {
                path: '/articleTypes',
                name: 'articleTypes',
                component: getComponent("home", "index")
            },
        ]
    },
]

export default router;