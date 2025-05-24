import {
  createRouter,
  createWebHistory,
  type Router,
  type RouteRecordRaw,
} from "vue-router";
import DefaultLayout from "@/layouts/default.vue";
import AdminLayout from "@/layouts/admin.vue";
import Home from "@/pages/User/Home/index.vue";
import Campaign from "@/pages/User/Campaign/index.vue";
import Error401 from "@/pages/Error/Error401.vue";
import Error404 from "@/pages/Error/Error404.vue";
import Dashboard from "@/pages/Admin/Dashboard/index.vue";
import AdminCategory from "@/pages/Admin/Category/index.vue";
import AdminCampaign from "@/pages/Admin/Campaign/index.vue";
import AdminCreateCampaign from "@/pages/Admin/Campaign/CreateCampaign.vue";
import AdminUpdateCampaign from "@/pages/Admin/Campaign/UpdateCampaign.vue";
import AdminUser from "@/pages/Admin/Users/index.vue";

export const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: DefaultLayout,
    children: [
      {
        path: "",
        component: Home,
      },
      {
        path: "campaigns",
        component: Campaign,
      },
    ],
  },
  {
    path: "/admin",
    component: AdminLayout,
    meta: {
      requiresAdmin: true,
    },
    children: [
      {
        path: "",
        redirect: "/admin/dashboard",
      },
      {
        path: "dashboard",
        component: Dashboard,
      },
      {
        path: "users",
        component: AdminUser,
      },
      {
        path: "categories",
        component: AdminCategory,
      },
      {
        path: "campaigns",
        component: AdminCampaign,
      },
      {
        path: "campaigns/create",
        component: AdminCreateCampaign,
      },
      {
        path: "campaigns/edit/:id",
        meta: {
          requireExistId: true,
        },
        component: AdminUpdateCampaign,
      },
    ],
  },
  {
    path: "/error/401",
    component: Error401,
  },
  {
    path: "/error/404",
    component: Error404,
  },
  {
    path: "/:pathMatch(.*)*",
    component: Error404,
  },
];

const router: Router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
