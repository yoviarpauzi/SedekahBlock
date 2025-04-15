import {
  createMemoryHistory,
  createRouter,
  type Router,
  type RouteRecordRaw,
} from "vue-router";
import DefaultLayout from "@/layouts/default.vue";
import Home from "@/pages/Home.vue";

export const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: DefaultLayout,
    children: [
      {
        path: "/",
        component: Home,
      },
    ],
  },
];

const router: Router = createRouter({
  history: createMemoryHistory(),
  routes,
});

export default router;
