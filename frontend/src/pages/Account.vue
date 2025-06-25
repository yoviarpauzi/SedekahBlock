<template>
  <form @submit="onSubmit" class="space-y-6">
    <div :class="!isAdmin ? 'pt-20 pb-10' : ''">
      <div :class="!isAdmin ? 'container' : ''">
        <div class="bg-white rounded-lg shadow-sm border">
          <div class="p-6 border-b">
            <h2 class="text-2xl font-semibold text-gray-900">
              Account Settings
            </h2>
            <p class="text-sm text-gray-600 mt-1">
              Update your profile photo and username
            </p>
          </div>

          <div class="p-6 space-y-6">
            <!-- Profile Photo Upload -->
            <FormField name="file_picture">
              <FormItem>
                <FormLabel></FormLabel>
                <FormControl>
                  <div
                    class="flex flex-col sm:flex-row items-start sm:items-center sm:space-x-6 space-y-4 sm:space-y-0"
                  >
                    <!-- Gambar dan upload -->
                    <div class="relative self-center sm:self-auto">
                      <img
                        :src="
                          profile
                            ? profile.includes('ui-avatars.com')
                              ? profile
                              : `${serverURI}/${profile}`
                            : 'https://ui-avatars.com/api/?name=ID'
                        "
                        class="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                      />
                      <label
                        class="absolute -bottom-1 -right-1 bg-green-500 hover:bg-green-600 text-white p-1.5 rounded-full cursor-pointer transition-colors"
                      >
                        <svg
                          class="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                          />
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <input
                          type="file"
                          accept="image/*"
                          class="hidden"
                          @change="handleFileChange"
                        />
                      </label>
                    </div>

                    <!-- Teks -->
                    <div class="text-center sm:text-left">
                      <h3 class="text-lg font-medium text-gray-900">
                        Profile Photo
                      </h3>
                      <p class="text-sm text-gray-600 mt-1">
                        Click the camera icon to upload a new photo.
                      </p>
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <!-- Username Input -->
            <FormField name="name" v-slot="{ componentField }">
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    v-bind="componentField"
                    placeholder="Enter your username"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <!-- Buttons -->
            <div class="flex justify-end space-x-3 pt-4 border-t">
              <Button
                type="button"
                @click="form.resetForm()"
                class="bg-gray-200 hover:bg-gray-300 text-gray-700"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                :disabled="isLoading"
                class="bg-green-500 hover:bg-green-600 text-white"
              >
                <svg
                  v-if="isLoading"
                  class="animate-spin w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span>{{ isLoading ? "Saving..." : "Save Changes" }}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRoute } from "vue-router";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import useAuthStore from "@/stores/auth-store";
import showToast from "@/utils/showToast";
import z from "zod";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import Input from "@/components/ui/input/Input.vue";
import Button from "@/components/ui/button/Button.vue";
import { serverURI } from "@/utils/environment";

const route = useRoute();
const isAdmin = route.path.includes("/admin");
const authStore = useAuthStore();
const isLoading = ref(false);
const profileSchema = z.object({
  name: z.string().min(1, "Username wajib diisi"),
  file_picture: z
    .any()
    .refine((file) => file instanceof File || file === null, {
      message: "Gambar tidak valid",
    })
    .refine((file) => !file || file.size <= 2 * 1024 * 1024, {
      message: "Ukuran gambar maksimal 2MB",
    })
    .refine((file) => !file || file.type.startsWith("image/"), {
      message: "File harus berupa gambar",
    }),
});
const profile = ref(authStore.profile_picture);

const form = useForm({
  validationSchema: toTypedSchema(profileSchema),
  initialValues: {
    name: authStore.name!,
    file_picture: null,
  },
});

const { handleSubmit, setFieldValue } = form;

const onSubmit = handleSubmit(async (values) => {
  try {
    isLoading.value = true;
    console.log(values);
    await authStore.updateProfile(
      authStore.id!,
      values.name,
      values.file_picture!
    );
    authStore.name = values.name;

    showToast("success", "Berhasil", "Perubahan berhasil disimpan");
  } catch (err) {
    showToast("error", "Gagal", "Gagal menyimpan perubahan");
  } finally {
    isLoading.value = false;
  }
});

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    setFieldValue("file_picture", file);
    const reader = new FileReader();
    reader.onload = () => {
      profile.value = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
};
</script>
