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
import AdminCampaignDetail from "@/pages/Admin/Campaign/DetailCampaign.vue";
import DetailCampaign from "@/pages/User/Campaign/DetailCampaign.vue";
import DonationHistory from "@/pages/User/Campaign/DonationHistory.vue";
import News from "@/pages/User/Campaign/News.vue";
import FundDisbursement from "@/pages/User/Campaign/FundDisbursement.vue";
import CreateNews from "@/pages/Admin/Campaign/CreateNews.vue";
import UpdateNews from "@/pages/Admin/Campaign/UpdateNews.vue";
import CreateWithdraw from "@/pages/Admin/Campaign/CreateWithdraw.vue";
import UpdateWithdraw from "@/pages/Admin/Campaign/UpdateWithdraw.vue";
import CreateTransfer from "@/pages/Admin/Campaign/CreateTransfer.vue";
import Account from "@/pages/Account.vue";

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
      {
        path: "campaigns/details/:id",
        component: DetailCampaign,
      },
      {
        path: "campaigns/details/:id/histories",
        meta: {
          requireExistId: true,
        },
        component: DonationHistory,
      },
      {
        path: "campaigns/details/:id/news",
        meta: {
          requireExistId: true,
        },
        component: News,
      },
      {
        path: "campaigns/details/:id/fund_disbursment",
        meta: {
          requireExistId: true,
        },
        component: FundDisbursement,
      },
      {
        path: "/account",
        meta: {
          requireConnect: true,
        },
        component: Account,
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
      {
        path: "campaigns/details/:id",
        meta: {
          requireExistId: true,
        },
        component: AdminCampaignDetail,
      },
      {
        path: "campaigns/details/:id/news/create",
        meta: {
          requireExistId: true,
        },
        component: CreateNews,
      },
      {
        path: "campaigns/details/:id/news/:newsId/update",
        meta: {
          requireExistId: true,
          requireNewsExistId: true,
        },
        component: UpdateNews,
      },
      {
        path: "campaigns/details/:id/withdraw/create",
        meta: {
          requireExistId: true,
        },
        component: CreateWithdraw,
      },
      {
        path: "campaigns/details/:id/withdraw/:withdrawId/update",
        meta: {
          requireExistId: true,
          requireWithdrawExistId: true,
        },
        component: UpdateWithdraw,
      },
      {
        path: "campaigns/details/:id/transfer/create",
        meta: {
          requireExistId: true,
        },
        component: CreateTransfer,
      },
      {
        path: "account",
        meta: {
          requiresAdmin: true,
        },
        component: Account,
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
  scrollBehavior: () => {
    return {
      top: 0,
    };
  },
});

export default router;
