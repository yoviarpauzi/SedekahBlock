<template>
  <div>
    <DataTable :columns="columns" :data="data" :rowCount="rowCount" />
  </div>
</template>

<script setup lang="ts">
import type { User } from "@/components/admin/table/user/columns";
import { onMounted, ref, watch } from "vue";
import { columns } from "@/components/admin/table/user/columns";
import DataTable from "@/components/admin/table/user/DataTable.vue";
import axios from "axios";
import { serverURI } from "@/utils/environment";
import { useRoute } from "vue-router";

const data = ref<User[]>([]);
const rowCount = ref(0);
const route = useRoute();

async function getData() {
  const page: number = Number(route.query.page) ?? 1;
  const search = route.query.search ?? "";

  const res = await axios.get(
    `${serverURI}/api/users?&page=${page}&search=${search}`,
    {
      withCredentials: true,
    }
  );

  const { data } = res.data;
  const { users, rowCount } = data;

  return {
    users,
    rowCount,
  };
}

const getUserData = async () => {
  const fetchData = await getData();
  data.value = fetchData.users;
  rowCount.value = fetchData.rowCount;
};

watch(
  () => route.query,
  async () => {
    await getUserData();
  }
);

onMounted(async () => {
  await getUserData();
});
</script>
