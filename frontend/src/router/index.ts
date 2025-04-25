import {
  createMemoryHistory,
  createRouter,
  type Router,
  type RouteRecordRaw,
} from "vue-router";
import DefaultLayout from "@/layouts/default.vue";
import Home from "@/pages/Home/index.vue";
import Campaign from "@/pages/Campaign/index.vue";

export const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: DefaultLayout,
    children: [
      {
        path: "/",
        component: Home,
      },
      {
        path: "/campaign",
        component: Campaign,
      },
    ],
  },
];

const router: Router = createRouter({
  history: createMemoryHistory(),
  routes,
});

export default router;
