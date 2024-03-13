import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "../views/Login";
import Index from "../views/Index";
import store from "../store";
import BoardDetails from "../components/BoardDetails";
import {initMenu} from "@/utils/menu";

Vue.use(VueRouter);

const routes = [
    {
        //login
        path: '/login',
        name: Login,
        component: Login
    },
    {
        //homepage
        path: '/',
        name: Index,
        redirect: '/home',
        component: Index,
        meta: {
            requireAuth: true
        }
    },
    {
        path: '/',
        name: Index,
        redirect: '/home',
        component: Index,
        children: [
            {
                path: 'boardDetails',
                name: 'boardDetails',
                component: BoardDetails,
            },
        ],
        meta: {
            requireAuth: true
        }
    },
];

const router = new VueRouter({
    mode: 'history',
    routes
});

router.beforeEach((to, from, next) => {
    store.state.user = sessionStorage.getItem("user");

    if (to.path === '/login') {
        //hook
        next();
    } else {
        if (window.localStorage.getItem('user') || window.sessionStorage.getItem('user')) {
            initMenu(router, store);
            next();
        } else {
            location.replace('/login');
        }
    }
});

router.afterEach(router => {
    //add loading effect
});

export default router
