<template>
  <div
    v-show="loading"
    class="fixed inset-0 flex items-center justify-center gap-4 z-50 opacity-0"
    ref="preloader"
  >
    <img
      src="/logo.png"
      alt="SedekahBlock Logo"
      class="w-10 scale-0 opacity-0 blur-sm"
      ref="logo"
    />
    <h4 class="text-green-800 text-xl font-bold font-jakarta" ref="text">
      <span
        class="letter inline-block"
        v-for="(char, index) in 'Sedekah'"
        :key="index"
        >{{ char }}</span
      >
      <span
        class="text-green-500 letter inline-block"
        v-for="(char, index) in 'Block'"
        :key="'block' + index"
        >{{ char }}</span
      >
    </h4>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { gsap } from "gsap";

const loading = defineModel("loading");
const preloader = ref<HTMLElement | null>(null);
const logo = ref<HTMLElement | null>(null);
const text = ref<HTMLElement | null>(null);

onMounted(() => {
  gsap.set(preloader.value, {
    opacity: 1,
    background: "linear-gradient(45deg, #F0FDF4, #BBF7D0, #F0FDF4)",
    backgroundSize: "200% 200%",
  });

  gsap.set(logo.value, { scale: 0, opacity: 0, filter: "blur(4px)" });
  gsap.set(".letter", { opacity: 0, y: 30 });

  const tl = gsap.timeline();

  tl.to(
    logo.value,
    {
      scale: 1,
      opacity: 1,
      filter: "blur(0px) drop-shadow(0 0 8px rgba(34, 197, 94, 0.5))",
      duration: 0.8,
      ease: "elastic.out(1, 0.4)",
    },
    0.2
  );

  tl.to(
    ".letter",
    {
      opacity: 1,
      y: 0,
      duration: 0.4,
      ease: "power2.out",
      stagger: 0.03,
    },
    0.4
  );

  tl.to(
    logo.value,
    {
      scale: 1.05,
      rotation: 5,
      duration: 0.5,
      yoyo: true,
      repeat: 1,
      ease: "sine.inOut",
    },
    1.0
  );

  setTimeout(() => {
    const exitTl = gsap.timeline({
      onComplete: () => {
        loading.value = false;
      },
    });

    exitTl.to(
      logo.value,
      {
        scale: 1.3,
        opacity: 0,
        filter: "blur(6px)",
        duration: 0.4,
        ease: "power2.in",
      },
      0
    );

    exitTl.to(
      ".letter",
      {
        opacity: 0,
        y: () => gsap.utils.random(-20, 20),
        x: () => gsap.utils.random(-20, 20),
        duration: 0.3,
        ease: "power2.in",
        stagger: 0.02,
      },
      0.1
    );

    exitTl.to(
      preloader.value,
      {
        background: "linear-gradient(45deg, #BBF7D0, #86EFAC)",
        duration: 0.3,
        ease: "power2.inOut",
      },
      0
    );
    exitTl.to(
      preloader.value,
      {
        opacity: 0,
        filter: "blur(5px)",
        duration: 0.3,
        ease: "power2.in",
      },
      0.2
    );
  }, 2500);
});
</script>
