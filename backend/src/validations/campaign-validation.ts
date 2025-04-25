import z from "zod";

const upsert = z.object({
  categories_id: z.number(),
  name: z.string().max(100),
  target: z.bigint(),
  end_at: z.date(),
});

export default {
  upsert,
};
