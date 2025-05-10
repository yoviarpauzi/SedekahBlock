import z from "zod";

const update = z.object({
  name: z.string(),
});

export default {
  update,
};
