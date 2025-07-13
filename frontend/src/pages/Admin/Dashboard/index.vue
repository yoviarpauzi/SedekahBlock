<template>
  <!-- Header -->
  <h2 class="text-2xl font-bold text-gray-900">Dashboard</h2>

  <!-- Stats Cards -->
  <div
    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6"
  >
    <div
      class="bg-white rounded-lg shadow-md border border-gray-200 p-6 transition-all duration-300 hover:shadow-lg"
    >
      <div>
        <p class="text-sm font-semibold text-gray-500 mb-1">Jumlah User</p>
        <div class="flex items-center justify-between mt-2">
          <p class="text-3xl font-bold text-gray-900">
            {{ dashboardData.user_count || 0 }}
          </p>
          <div class="p-3 bg-blue-100 rounded-full">
            <svg
              class="w-7 h-7 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
              ></path>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <div
      class="bg-white rounded-lg shadow-md border border-gray-200 p-6 transition-all duration-300 hover:shadow-lg"
    >
      <div>
        <p class="text-sm font-semibold text-gray-500 mb-1">Jumlah Kategori</p>
        <div class="flex items-center justify-between mt-2">
          <p class="text-3xl font-bold text-gray-900">
            {{ dashboardData.category_count || 0 }}
          </p>
          <div class="p-3 bg-green-100 rounded-full">
            <svg
              class="w-7 h-7 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              ></path>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <div
      class="bg-white rounded-lg shadow-md border border-gray-200 p-6 transition-all duration-300 hover:shadow-lg"
    >
      <div>
        <p class="text-sm font-semibold text-gray-500 mb-1">Jumlah Kampanye</p>
        <div class="flex items-center justify-between mt-2">
          <p class="text-3xl font-bold text-gray-900">
            {{ dashboardData.campaigns_count || 0 }}
          </p>
          <div class="p-3 bg-purple-100 rounded-full">
            <svg
              class="w-7 h-7 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              ></path>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <div
      class="bg-white rounded-lg shadow-md border border-gray-200 p-6 transition-all duration-300 hover:shadow-lg"
    >
      <div>
        <p class="text-sm font-semibold text-gray-500 mb-1">
          Kampanye Berlangsung
        </p>
        <div class="flex items-center justify-between mt-2">
          <p class="text-3xl font-bold text-gray-900">
            {{ dashboardData.active_campaigns_count || 0 }}
          </p>
          <div class="p-3 bg-orange-100 rounded-full">
            <svg
              class="w-7 h-7 text-orange-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              ></path>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <div
      class="bg-white rounded-lg shadow-md border border-gray-200 p-6 transition-all duration-300 hover:shadow-lg"
    >
      <div>
        <p class="text-sm font-semibold text-gray-500 mb-1">
          Donasi Tersalurkan
        </p>
        <div class="flex items-center justify-between mt-2">
          <p class="text-3xl font-bold text-gray-900">
            {{ dashboardData.total_donation_distributed || 0 }}
            <span class="text-base text-gray-500">TON</span>
          </p>
          <div class="p-3 bg-emerald-100 rounded-full">
            <svg
              class="w-7 h-7 text-emerald-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08-.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
              ></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Charts Section -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <!-- Monthly Donation Amount Chart -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-1">
          Donasi Bulanan (TON)
        </h3>
        <p class="text-sm text-gray-600">Total donasi dalam TON per bulan</p>
      </div>
      <apexchart
        height="350"
        type="area"
        :options="donationAmountOptions"
        :series="donationAmountSeries"
      ></apexchart>
    </div>

    <!-- Monthly Donation Count Chart -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-1">
          Jumlah Donasi Bulanan
        </h3>
        <p class="text-sm text-gray-600">Jumlah donasi per bulan</p>
      </div>
      <apexchart
        height="350"
        type="bar"
        :options="donationCountOptions"
        :series="donationCountSeries"
      ></apexchart>
    </div>
  </div>
</template>

<script setup lang="ts">
import { serverURI } from "@/utils/environment";
import axios from "axios";
import { onMounted, ref, computed } from "vue";

interface DashboardData {
  user_count: number;
  active_campaigns_count: number;
  campaigns_count: number;
  category_count: number;
  total_donation_distributed: number;
  monthly_donation: {
    donation_count: number;
    month: string;
    total_amount: number;
  }[];
}

const dashboardData = ref({} as DashboardData);

// Computed properties untuk chart data
const donationAmountSeries = computed(() => {
  if (!dashboardData.value.monthly_donation?.length) return [];
  return [
    {
      name: "Donasi (TON)",
      data: dashboardData.value.monthly_donation.map(
        (item) => item.total_amount
      ),
    },
  ];
});

const donationCountSeries = computed(() => {
  if (!dashboardData.value.monthly_donation?.length) return [];
  return [
    {
      name: "Jumlah Donasi",
      data: dashboardData.value.monthly_donation.map(
        (item) => item.donation_count
      ),
    },
  ];
});



const donationAmountOptions = computed(() => ({
  chart: {
    type: "bar",
    toolbar: {
      show: false,
    },
    fontFamily: "Inter, sans-serif",
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: "smooth",
    width: 2,
  },
  colors: ["#3B82F6"],
  fill: {
    type: "gradient",
    gradient: {
      shadeIntensity: 1,
      type: "vertical",
      colorStops: [
        {
          offset: 0,
          color: "#3B82F6",
          opacity: 0.4,
        },
        {
          offset: 100,
          color: "#3B82F6",
          opacity: 0.1,
        },
      ],
    },
  },
  xaxis: {
    categories: dashboardData.value.monthly_donation?.map(
      (item) => item.month
    ) || ["Juni"],
    labels: {
      style: {
        fontSize: "12px",
        fontWeight: 500,
        colors: "#6B7280",
      },
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    labels: {
      formatter: function (val: number) {
        return val.toFixed(1) + " TON";
      },
      style: {
        fontSize: "12px",
        fontWeight: 500,
        colors: "#6B7280",
      },
    },
  },
  grid: {
    borderColor: "#F3F4F6",
    strokeDashArray: 4,
    xaxis: {
      lines: {
        show: false,
      },
    },
  },
  tooltip: {
    y: {
      formatter: function (val: number) {
        return val.toFixed(2) + " TON";
      },
    },
  },
}));

// Chart options untuk jumlah donatur
const donationCountOptions = computed(() => ({
  chart: {
    type: "bar",
    toolbar: {
      show: false,
    },
    fontFamily: "Inter, sans-serif",
  },
  dataLabels: {
    enabled: false,
  },
  colors: ["#10B981"],
  plotOptions: {
    bar: {
      borderRadius: 6,
      columnWidth: "60%",
    },
  },
  xaxis: {
    categories:
      dashboardData.value.monthly_donation?.map((item) => item.month) || [],
    labels: {
      style: {
        fontSize: "12px",
        fontWeight: 500,
        colors: "#6B7280",
      },
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    labels: {
      formatter: function (val: number) {
        return val.toString();
      },
      style: {
        fontSize: "12px",
        fontWeight: 500,
        colors: "#6B7280",
      },
    },
  },
  grid: {
    borderColor: "#F3F4F6",
    strokeDashArray: 4,
    xaxis: {
      lines: {
        show: false,
      },
    },
  },
  tooltip: {
    y: {
      formatter: function (val: number) {
        return val + " donasi";
      },
    },
  },
}));

onMounted(async () => {
  try {
    const response = await axios.get(`${serverURI}/api/dashboard`, {
      withCredentials: true,
    });

    const { data } = response.data;
    dashboardData.value = data;
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
  }
});
</script>
