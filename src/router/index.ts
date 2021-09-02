import { createRouter, createWebHistory } from 'vue-router'

import routes from "./routes"

const routerHistory = createWebHistory()
const router = createRouter({
    history: routerHistory,
    routes,
})

router.beforeEach((to, from, next) => {
    // console.log(to, "---", from)
    next()
})

export default router