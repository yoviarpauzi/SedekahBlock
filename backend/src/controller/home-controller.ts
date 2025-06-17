import { NextFunction, Request, Response } from "express";
import prisma from "../config/database";

const index = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result: any = await prisma.$queryRawUnsafe(`
      SELECT
        (SELECT COUNT(*) FROM campaigns WHERE is_active = true) AS "activeDonation",
        (SELECT COUNT(*) FROM campaigns WHERE is_withdraw = true) AS "donationDistributed",
        (SELECT json_agg(row_to_json(c)) FROM (
          SELECT *
          FROM campaigns
          ORDER BY end_at ASC, balance ASC
          LIMIT 10
        ) c) AS "urgentFundraising",
        (SELECT json_agg(row_to_json(c)) FROM (
          SELECT *
          FROM campaigns
          ORDER BY created_at DESC
          LIMIT 10
        ) c) AS "foundationChoice";
    `);

    const data = result[0];

    res.status(200).json({
      message: "success receive campaign",
      data: {
        donationStatistic: {
          activeDonation: Number(data.activeDonation),
          donationDistributed: Number(data.donationDistributed),
        },
        urgentFundraising: data.urgentFundraising,
        foundationChoice: data.foundationChoice,
      },
    });
  } catch (err) {
    next(err);
  }
};

export default {
  index,
};
