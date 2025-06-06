import { NextFunction, Request, Response } from "express";
import campaignService from "../services/campaign-service";
import ResponseError from "../error/response-error";
import path from "path";
import fs from "fs/promises";
import moveImageFromTemp from "../utils/moveImageFromTemp";
import extractMatches from "../utils/extractImageFileName";

const regex = /\/campaigns\/content\/([^"' ]+)/g;
const urlRegex: RegExp = /http?:\/\/[^"' ]+\/campaigns\/content\/([^"' ]+)/g;
const tempDir = path.resolve(__dirname, "./../temp/campaigns/content");
const storageDir = path.resolve(__dirname, "./../storage/campaigns/content");

const getBaseUrl = (req: Request): string =>
  `${req.protocol}://${req.get("host")}`;

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const content = req.body.story;

    await moveImageFromTemp({
      content,
      urlRegex,
      tempDir,
      storageDir,
      baseUrl: getBaseUrl(req),
    });

    const thumbnail = `campaigns/thumbnail/${req.file?.filename}`;

    const body = {
      ...req.body,
      categories_id: Number(req.body.categories_id),
      target: Number(req.body.target),
      end_at: new Date(req.body.end_at),
      thumbnail,
    };

    const campaign = await campaignService.create(body);

    res.status(200).json({
      message: "success",
      data: campaign,
    });
  } catch (err) {
    next(err);
  }
};

export const update = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);
    const content = req.body.story;

    if (isNaN(id)) {
      throw new ResponseError(400, "Invalid campaign id");
    }

    const oldCampaign = await campaignService.getCampaign(id);

    if (!oldCampaign) {
      throw new ResponseError(404, "Campaign ID not found");
    }

    await moveImageFromTemp({
      content,
      urlRegex,
      tempDir,
      storageDir,
      baseUrl: getBaseUrl(req),
    });

    const body: any = {
      ...req.body,
      categories_id: Number(req.body.categories_id),
      target: Number(req.body.target),
    };

    if (body.end_at) {
      body.end_at = new Date(req.body.end_at);
    } else {
      delete body.end_at;
    }

    if (req.file?.filename) {
      const newThumbnail = `campaigns/thumbnail/${req.file.filename}`;
      if (oldCampaign.thumbnail) {
        const oldThumbnailPath = path.resolve(
          __dirname,
          `../storage/${oldCampaign.thumbnail}`
        );
        try {
          await fs.unlink(oldThumbnailPath);
        } catch (err) {
          throw err;
        }
      }
      body.thumbnail = newThumbnail;
    } else {
      body.thumbnail = oldCampaign.thumbnail;
    }

    const newStory = req.body.story;
    const oldStory = oldCampaign.story!;

    if (newStory && newStory !== oldStory) {
      const oldImages = extractMatches({ content: oldStory, regex });
      const newImages = extractMatches({ content: newStory, regex });

      const removedImages = oldImages.filter((img) => !newImages.includes(img));

      await Promise.all(
        removedImages.map(async (filename) => {
          const filePath = path.resolve(
            __dirname,
            `../storage/campaigns/content/${filename}`
          );
          try {
            await fs.unlink(filePath);
          } catch (err) {
            throw err;
          }
        })
      );

      body.story = newStory;
    } else {
      body.story = oldStory;
    }

    delete body.id;

    const campaign: any = await campaignService.update(id, body);

    res.status(200).json({
      message: "success update data",
      data: campaign,
    });
  } catch (err) {
    next(err);
  }
};

const getCampaign = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    const campaign = await campaignService.getCampaign(id);

    if (!campaign) {
      throw new ResponseError(404, "campaign id not found");
    }

    res.status(200).json({
      message: "success retrieve data",
      data: campaign,
    });
  } catch (err) {
    next(err);
  }
};

const getCampaigns = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = { ...req.query, page: req.query.page ?? "1" };

    const { campaigns, rowCount } = await campaignService.getAllCampaign(query);

    res.status(200).json({
      message: "success retrieve campaigns",
      data: {
        campaigns,
        rowCount,
      },
    });
  } catch (err) {
    next(err);
  }
};

const isTitleExist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const title = req.query.title?.toString() ?? "";

    const isExist = await campaignService.isCampaignTitleExist(title);

    res.status(200).json({
      data: isExist,
    });
  } catch (err) {
    next(err);
  }
};

const uploadCampaignImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) {
      throw new ResponseError(400, "no file uploaded");
    }

    const fileUrl = `${req.protocol}://${req.get("host")}/campaigns/content/${
      req.file.filename
    }`;

    res.status(200).json({
      message: "success upload image content",
      url: fileUrl,
    });
  } catch (err) {
    next(err);
  }
};

const destroy = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const campaignId = Number(req.params.id);

    if (isNaN(campaignId)) {
      throw new ResponseError(400, "Invalid campaign ID");
    }

    const campaign = await campaignService.getCampaign(campaignId);

    if (!campaign) {
      throw new ResponseError(404, "Campaign not found");
    }

    if (campaign.thumbnail) {
      const thumbnailPath = path.resolve(
        __dirname,
        `../storage/${campaign.thumbnail}`
      );
      try {
        await fs.unlink(thumbnailPath);
      } catch (err) {
        throw err;
      }
    }

    const imageFilenames = extractMatches({
      content: campaign.story!,
      regex,
    });

    await Promise.all(
      imageFilenames.map(async (filename) => {
        const imagePath = path.resolve(
          __dirname,
          `../storage/campaigns/content/${filename}`
        );
        try {
          await fs.unlink(imagePath);
        } catch (err) {
          throw err;
        }
      })
    );

    await campaignService.destroy(campaignId);

    res.status(200).json({
      message: "success delete campaign",
    });
  } catch (err) {
    next(err);
  }
};

export default {
  create,
  update,
  getCampaign,
  getCampaigns,
  isTitleExist,
  uploadCampaignImage,
  destroy,
};
