import {RouteRecordRaw} from "vue-router";

export const redirects: Array<RouteRecordRaw> = [
    {
        path: '/',
        redirect: '/tabs/home'
    },
]