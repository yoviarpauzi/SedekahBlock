import z from "zod";

const name = z.string().max(100);

const create = z.object({
  name: name,
});

const update = z.object({
  id: z.number().positive(),
  name: name,
});

export default {
  create,
  update,
};
