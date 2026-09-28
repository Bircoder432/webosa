import { createRouter, createWebHistory } from "vue-router";
import ScheduleView from "../views/ScheduleView.vue";

const routes = [
    {
        path: "/",
        name: "schedule",
        component: ScheduleView,
    },
    {
        path: "/app",
        name: "app-download",
        component: () => import("../views/AppDownloadView.vue"),
    },
    { path: "/:pathMatch(.*)*", redirect: "/" },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        return savedPosition ?? { top: 0 };
    },
});

export default router;
