import z from "zod";

const fileSizeLimit = 2 * 1024 * 1024; // 2MB

const update = z.object({
  name: z.string(),
  email: z.string(),
});

const updateProfile = z
  .instanceof(File)
  .refine((file) => ["image/png"].includes(file.type), {
    message: "invalid image file type",
  })
  .refine((file) => file.size <= fileSizeLimit, {
    message: "file size should not exceed 2MB",
  });

export default {
  update,
  updateProfile,
};
