import prisma from "../config/database";
import ResponseError from "../error/response-error";

const create = async (campaign: {
  categories_id: number;
  name: string;
  target: bigint;
  end_at: Date;
}) => {
  try {
    const isCampaignExists = await prisma.campaign.findUnique({
      where: {
        name: campaign.name,
      },
    });

    if (isCampaignExists) {
      throw new ResponseError(409, "campaign name is already exists");
    }

    return await prisma.campaign.create({
      data: campaign,
    });
  } catch (err) {
    throw err;
  }
};

const update = async (
  id: bigint,
  campaign: {
    categories_id: number;
    name: string;
    target: bigint;
    end_at: Date;
  }
) => {
  try {
    const isCampaignExists = await getCampaign(id);

    if (isCampaignExists) {
      return await prisma.campaign.update({
        where: {
          id: id,
        },
        data: campaign,
      });
    }
  } catch (err) {
    throw err;
  }
};

const getCampaign = async (id: bigint) => {
  try {
    const campaign = await prisma.campaign.findUnique({
      where: {
        id: id,
      },
    });

    if (!campaign) {
      throw new ResponseError(404, "campaign not found");
    }

    return campaign;
  } catch (err) {
    throw err;
  }
};

const getCampaigns = async (page: number) => {
  try {
    return await prisma.campaign.findMany({});
  } catch (err) {
    throw err;
  }
};

export default {
  create,
  update,
  getCampaign,
  getCampaigns,
};
