import { Prisma } from "../../generated/prisma";
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

    const isCampaignTitleExists = await isCampaignTitleExist(campaign.title);

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

    return campaign;
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
    const isExist = await prisma.campaign.findUnique({
      where: {
        title: title,
      },
    });

    if (isExist) {
      return true;
    }

    return false;
  } catch (err) {
    throw err;
  }
};

const destroy = async (id: number) => {
  try {
    const isExist = await prisma.campaign.findUnique({
      where: {
        id,
      },
    });

    if (!isExist) {
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

export default {
  create,
  update,
  getCampaign,
  getAllCampaign,
  isCampaignTitleExist,
  destroy,
};
