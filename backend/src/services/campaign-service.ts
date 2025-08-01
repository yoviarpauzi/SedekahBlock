import { Prisma } from "../../generated/prisma";
import { Decimal } from "../../generated/prisma/runtime/library";
import prisma from "../config/database";
import ResponseError from "../error/response-error";

interface Campaign {
  categories_id: number;
  title: string;
  target: number;
  end_at: Date;
  thumbnail: string;
  story: string;
  balance?: number;
}

const create = async (campaign: Campaign) => {
  try {
    const isCampaignTitleExists = await isCampaignTitleExist(campaign.title);

    if (isCampaignTitleExists) {
      throw new ResponseError(409, "campaign title is already exists");
    }

    return await prisma.campaign.create({
      data: campaign,
    });
  } catch (err) {
    throw err;
  }
};

const update = async (id: number, campaign: Campaign) => {
  try {
    const isCampaignExists = await getCampaign(id);

    if (!isCampaignExists) {
      throw new ResponseError(404, "campaign id not found");
    }

    const isCampaignTitleExists =
      isCampaignExists.title == campaign.title ? true : false;

    if (isCampaignTitleExists && isCampaignExists.title !== campaign.title) {
      throw new ResponseError(409, "campaign title is already exists");
    }

    return await prisma.campaign.update({
      where: {
        id: id,
      },
      data: campaign,
    });
  } catch (err) {
    throw err;
  }
};

const getCampaign = async (id: number) => {
  try {
    const campaign = await prisma.campaign.findUnique({
      where: {
        id: id,
      },
      include: {
        news: {
          take: 1,
          orderBy: {
            updated_at: "desc",
          },
          select: {
            updated_at: true,
          },
        },
        fund_disbursement_histories: {
          take: 1,
          orderBy: {
            updated_at: "desc",
          },
          select: {
            updated_at: true,
          },
        },
        _count: {
          select: {
            news: true,
            fund_disbursement_histories: true,
            donation_histories: true,
          },
        },
      },
    });

    if (!campaign) {
      return null;
    }

    const totalTransferred = await prisma.transferHistories.aggregate({
      where: { campaigns_id: id },
      _sum: {
        amount: true,
      },
    });

    return {
      ...campaign,
      total_transferred: totalTransferred._sum.amount || 0,
    };
  } catch (err) {
    throw err;
  }
};

const getAllCampaign = async (query: any) => {
  const limit = Number(query.limit) || 10;
  const page = Number(query.page) || 1;
  const skip = (page - 1) * limit;

  const conditions: Prisma.Sql[] = [];

  if (query.search) {
    conditions.push(
      Prisma.sql`LOWER(title) LIKE ${`%${query.search.toLowerCase()}%`}`
    );
  }
  if (query.categories_id) {
    conditions.push(Prisma.sql`categories_id = ${Number(query.categories_id)}`);
  }
  if (query.category_type === "ongoing") {
    conditions.push(Prisma.sql`end_at > ${new Date()}`);
  }
  if (query.category_type === "conclude") {
    conditions.push(Prisma.sql`end_at < ${new Date()}`);
  }

  const whereClause =
    conditions.length > 0
      ? Prisma.sql`WHERE ${Prisma.join(conditions, ` AND `)}`
      : Prisma.sql``;

  const fullQuery = Prisma.sql`
    SELECT 
      json_agg(c.*) AS campaigns,
      (
        SELECT COUNT(*) FROM "campaigns" c2
        ${whereClause}
      ) AS row_count
    FROM (
      SELECT * FROM "campaigns"
      ${whereClause}
      ORDER BY created_at desc
      LIMIT ${limit} OFFSET ${skip}
    ) c;
  `;

  const result: any = await prisma.$queryRaw(fullQuery);

  return {
    campaigns: result[0]?.campaigns ?? [],
    rowCount: Number(result[0]?.row_count ?? 0),
  };
};

const isCampaignTitleExist = async (title: string): Promise<boolean> => {
  try {
    const campaign = await prisma.campaign.findUnique({
      where: {
        title: title,
      },
    });

    if (campaign) {
      return true;
    }

    return false;
  } catch (err) {
    throw err;
  }
};

const destroy = async (id: number) => {
  try {
    const campaign = await prisma.campaign.findUnique({
      where: {
        id,
      },
    });

    if (!campaign) {
      throw new ResponseError(404, "campaign ID not found");
    }

    await prisma.campaign.delete({
      where: {
        id,
      },
    });
  } catch (err) {
    throw err;
  }
};

const updateBalanceAndCollected = async (
  id: number,
  userId: number,
  link: string,
  amount: number
) => {
  try {
    const campaign = await prisma.campaign.findUnique({
      where: {
        id,
      },
      select: {
        balance: true,
        collected: true,
        operational_costs: true,
        total_withdraw_amount: true,
        donors: {
          where: {
            campaigns_id: id,
            users_id: userId,
          },
          select: {
            amount: true,
          },
        },
      },
    });

    if (!campaign) {
      throw new ResponseError(404, "campaign id not found");
    }

    // Hitung collected yang baru dulu
    const updateCollected: Decimal = campaign.collected.plus(
      new Decimal(amount)
    );

    const isEligible = updateCollected.greaterThanOrEqualTo(1);

    const updateBalance: Decimal = isEligible
      ? updateCollected.mul(0.95).minus(campaign.total_withdraw_amount)
      : campaign.balance.plus(new Decimal(amount));

    const updateOperationalCosts: Decimal = isEligible
      ? updateCollected.mul(0.05)
      : campaign.operational_costs;

    const currentDonorAmount: Decimal =
      campaign.donors[0]?.amount ?? new Decimal(0);
    const updateDonorAmount: Decimal = currentDonorAmount.plus(
      new Decimal(amount)
    );

    if (updateBalance.lessThan(0)) {
      throw new ResponseError(400, "Balance cannot be negative");
    }

    return await prisma.campaign.update({
      where: {
        id: id,
      },
      data: {
        balance: updateBalance,
        collected: updateCollected,
        operational_costs: updateOperationalCosts,
        donation_histories: {
          create: {
            users_id: userId,
            amount: amount,
            description: "donation",
            link: link,
          },
        },
        donors: {
          upsert: {
            where: {
              users_id_campaigns_id: {
                users_id: userId,
                campaigns_id: id,
              },
            },
            create: {
              amount: amount,
              user: {
                connect: { id: userId },
              },
            },
            update: {
              amount: updateDonorAmount,
            },
          },
        },
      },
    });
  } catch (err: any) {
    throw err;
  }
};

const getHistoryDonation = async (id: number, page: number = 1) => {
  const skip = 10 * (page - 1);
  const take = 10;

  const data = await prisma.donationHistory.findMany({
    where: {
      campaigns_id: id,
    },
    orderBy: {
      created_at: "desc",
    },
    include: {
      users: {
        select: {
          name: true,
          profile_picture: true,
        },
      },
    },
    take,
    skip,
  });

  const rowCount = await prisma.donationHistory.count({
    where: {
      campaigns_id: id,
    },
  });

  return { data, rowCount };
};

const toggleStatus = async (id: number, status: boolean) => {
  return await prisma.campaign.update({
    where: {
      id: id,
    },
    data: {
      is_active: !status,
    },
  });
};

const withdrawOperational = async (id: number) => {
  return await prisma.campaign.update({
    where: {
      id,
    },
    data: {
      is_admin_withdraw: true,
    },
  });
};

const getAllActiveCampaign = async () => {
  return await prisma.campaign.findMany({
    where: {
      is_active: true,
      end_at: {
        gt: new Date(),
      },
    },
    select: {
      id: true,
      title: true,
    },
    orderBy: {
      title: "asc",
    },
  });
};

export default {
  create,
  update,
  getCampaign,
  getAllCampaign,
  isCampaignTitleExist,
  destroy,
  updateBalanceAndCollected,
  getHistoryDonation,
  toggleStatus,
  withdrawOperational,
  getAllActiveCampaign,
};
