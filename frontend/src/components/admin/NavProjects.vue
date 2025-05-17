<template>
  <SidebarGroup class="group-data-[collapsible=icon]:hidden font-poppins">
    <SidebarMenu>
      <SidebarMenuItem v-for="item in projects" :key="item.name">
        <RouterLink :to="item.url" v-slot="{ isExactActive }">
          <SidebarMenuButton :isActive="isExactActive">
            <component :is="item.icon" />
            <span>{{ item.name }}</span>
          </SidebarMenuButton>
        </RouterLink>
      </SidebarMenuItem>
    </SidebarMenu>
  </SidebarGroup>
</template>

<script setup lang="ts">
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { type LucideIcon } from "lucide-vue-next";
import { RouterLink } from "vue-router";

defineProps<{
  projects: {
    name: string;
    url: string;
    icon: LucideIcon;
  }[];
}>();
</script>
