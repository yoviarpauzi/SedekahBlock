<template>
  <Sidebar v-bind="props">
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" as-child>
            <RouterLink to="/">
              <div
                class="flex aspect-square size-8 items-center justify-center rounded-lg text-sidebar-primary-foreground"
              >
                <img src="@/assets/images/logo.png" alt="" />
              </div>
              <div
                class="grid flex-1 text-left text-sm leading-tight font-jakarta"
              >
                <span class="truncate font-semibold text-green-800"
                  >Sedekah<span class="text-green-600">Block</span></span
                >
              </div>
            </RouterLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
    <SidebarContent>
      <NavProjects :projects="data.projects" />
    </SidebarContent>
    <SidebarFooter>
      <NavUser :user="data.user" />
    </SidebarFooter>
  </Sidebar>
</template>

<script setup lang="ts">
import NavProjects from "@/components/admin/NavProjects.vue";
import NavUser from "@/components/admin/NavUser.vue";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  type SidebarProps,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  User,
  HandCoins,
  ChartBarStacked,
} from "lucide-vue-next";
import { RouterLink } from "vue-router";

const props = withDefaults(defineProps<SidebarProps>(), {
  variant: "inset",
});

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  projects: [
    {
      name: "Dashboard",
      url: "/admin",
      icon: LayoutDashboard,
    },
    {
      name: "User",
      url: "/admin/users",
      icon: User,
    },
    {
      name: "Category",
      url: "/admin/categories",
      icon: ChartBarStacked,
    },
    {
      name: "Campaign",
      url: "/admin/campaigns",
      icon: HandCoins,
    },
  ],
};
</script>
