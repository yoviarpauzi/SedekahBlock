<template>
  <footer
    class="bg-gradient-to-b from-green-50 to-green-100 py-10 md:py-12 text-green-800"
  >
    <div class="container font-poppins">
      <div
        class="grid grid-cols-1 md:grid-cols-3 gap-8 items-start text-center md:text-left"
      >
        <!-- Logo and Social Media Section -->
        <div class="flex flex-col items-center md:items-start gap-4">
          <img
            src="@/assets/images/pribumi.png"
            alt="Pribumi Logo"
            class="w-24 drop-shadow-md"
          />
          <div class="flex gap-4">
            <a
              href="https://www.instagram.com/sedekahblock"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow us on Instagram"
            >
              <Instagram
                class="w-6 h-6 text-green-800 hover:text-green-900 hover:scale-110 transition-all duration-300"
              />
            </a>
            <a
              href="https://www.facebook.com/sedekahblock"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow us on Facebook"
            >
              <Facebook
                class="w-6 h-6 text-green-800 hover:text-green-900 hover:scale-110 transition-all duration-300"
              />
            </a>
          </div>
        </div>

        <div class="flex flex-col items-center md:items-center gap-3">
          <div class="flex flex-col md:flex-row gap-4">
            <RouterLink
              to="/"
              class="text-sm hover:underline transition-colors duration-300"
              >Beranda</RouterLink
            >

            <RouterLink
              to="/campaign"
              class="text-sm hover:underline transition-colors duration-300"
              >Kampanye</RouterLink
            >
          </div>
        </div>

        <!-- Contact Info and Copyright -->
        <div class="flex flex-col items-center md:items-end gap-4">
          <div class="flex flex-col items-center md:items-end gap-2">
            <div class="flex items-center gap-2">
              <Phone class="w-4 h-4 text-green-800" />
              <p class="text-sm">+62 123-456-7890</p>
            </div>
            <div class="flex items-center gap-2">
              <Mail class="w-4 h-4 text-green-800" />
              <p class="text-sm">info@sedekahblock.org</p>
            </div>
          </div>
          <div class="w-16 h-px bg-green-400 md:self-end"></div>
          <p class="text-xs text-green-800">
            © 2025 Yayasan Pribumi untuk Negeri. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
import { Phone, Mail, Instagram, Facebook } from "lucide-vue-next";
</script>
