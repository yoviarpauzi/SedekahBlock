import z from "zod";
import campaignService from "../services/campaign-service";

const upsert = z.object({
  categories_id: z.number(),
  title: z.string().max(100),
  target: z.number(),
  end_at: z.date(),
  thumbnail: z.string().max(100),
  campaign_story: z.string(),
  balance: z.number(),
});

export default {
  upsert,
};
