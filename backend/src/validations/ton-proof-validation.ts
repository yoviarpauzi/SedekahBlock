import z from "zod";

const proofPayload = z.object({
  address: z.string(),
  network: z.string(),
  proof: z.object({
    domain: z.object({
      lengthBytes: z.number(),
      value: z.string(),
    }),
    payload: z.string(),
    signature: z.string(),
    state_init: z.string(),
    timestamp: z.number(),
  }),
});

export default proofPayload;
