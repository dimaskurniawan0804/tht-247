import { RouteRecordRaw, createRouter, createWebHistory } from "vue-router";
import AppVue from "../App.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: AppVue,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export { routes };

export default router;
