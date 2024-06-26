import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [{
    path: '/login',
    component: () => import('../views/login.vue'),
},{     path: '',
    component: () => import('../views/home.vue'),
}, {
    path: '/zhuche',
    component: () => import('../views/zhuche.vue')
}, {
    path: '/home',
    component: () => import('../views/home.vue')
}, {
    path: '/art',
    component: () => import('../views/art.vue')
}, {
    path: '/post',
    component: () => import('../views/post.vue')
}, {
    path: '/cuang',
    component: () => import('../views/cuang.vue')
}, {
    path: '/change',
    component: () => import('../views/change.vue')
}, {
    path: '/myblog',
    component: () => import('../views/myblog.vue')
}, {
    path: '/details',
    component: () => import('../views/details.vue')
}, {
    path: '/authorDetail',
    component: () => import('../views/authorDetail.vue')
}
]
const router = createRouter({
    history: createWebHashHistory(),
    routes: routes
})

export default router