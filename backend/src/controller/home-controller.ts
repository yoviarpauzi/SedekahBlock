import { NextFunction, Request, Response } from "express";
import prisma from "../config/database";

const index = async (req: Request, res: Response, next: NextFunction) => {
  const [
    activeDonation,
    donationDistributed,
    urgentFundraising,
    foundationChoice,
  ] = await Promise.all([
    prisma.campaign.count({
      where: { is_active: true },
    }),
    prisma.campaign.count({
      where: { is_withdraw: true },
    }),
    prisma.campaign.findMany({
      take: 10,
      orderBy: [{ end_at: "asc" }],
    }),
    prisma.campaign.findMany({
      take: 10,
      orderBy: [{ collected: "desc" }],
    }),
  ]);

  const donationStatistic = {
    activeDonation,
    donationDistributed,
  };

  res.status(200).json({
    message: "success receive campaign",
    data: {
      donationStatistic,
      urgentFundraising,
      foundationChoice,
    },
  });
};

export default {
  index,
};
