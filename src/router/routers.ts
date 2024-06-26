import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [{
    path: '/home',
    component: () => import('../views/home.vue')
},{
    path: '/post',
    component: () => import('../views/post.vue')
},{
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