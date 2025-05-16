import prisma from "../config/database";
import ResponseError from "../error/response-error";

interface Campaign {
  categories_id: number;
  title: string;
  target: number;
  end_at: Date;
  thumbnail: string;
  campaign_story: string;
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

    if (isCampaignTitleExists) {
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
    });

    return campaign;
  } catch (err) {
    throw err;
  }
};

const getAllCampaign = async (page: number, search: string, limit: number) => {
  try {
    const skip = (page - 1) * limit;

    const where: {
      title?: {
        contains: string;
        mode: "insensitive";
      };
    } = {
      ...(search && {
        title: {
          contains: search,
          mode: "insensitive",
        },
      }),
    };

    const [campaigns, rowCount] = await Promise.all([
      prisma.campaign.findMany({
        skip,
        take: limit,
        where,
      }),
      prisma.campaign.count({ where }),
    ]);

    return [campaigns, rowCount];
  } catch (err) {
    throw err;
  }
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

export default {
  create,
  update,
  getCampaign,
  getAllCampaign,
  isCampaignTitleExist,
};
