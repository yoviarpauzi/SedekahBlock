import { NextFunction, Request, Response } from "express";
import campaignService from "../services/campaign-service";
import ResponseError from "../error/response-error";
import path from "path";
import fs from "fs/promises";

const moveImageFromTemp = async (req: Request) => {
  const urlRegex = /http?:\/\/[^"' ]+\/campaigns\/content\/([^"' ]+)/g;
  const tempDir = path.resolve(__dirname, "./../temp/campaigns/content");
  const storageDir = path.resolve(__dirname, "./../storage/campaigns/content");

  const filenamesToMove = new Set<string>();
  let match;
  while ((match = urlRegex.exec(req.body.campaign_story)) !== null) {
    filenamesToMove.add(match[1]);
  }

  await fs.mkdir(storageDir, { recursive: true });

  for (const filename of filenamesToMove) {
    const tempPath = path.join(tempDir, filename);
    const storagePath = path.join(storageDir, filename);

    try {
      await fs.rename(tempPath, storagePath);

      const tempUrl = `${req.protocol}://${req.get(
        "host"
      )}/campaigns/content/${filename}`;
      req.body.campaign_story = req.body.campaign_story.replace(
        new RegExp(tempUrl, "g"),
        tempUrl
      );
    } catch (err) {
      throw err;
    }
  }
};

const extractImageFilenames = (story?: string): string[] => {
  return Array.from(story?.match(/\/campaigns\/content\/([^"' ]+)/g) || [])
    .map((url) => url.split("/").pop() || "")
    .filter(Boolean);
};

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await moveImageFromTemp(req);

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
    const id = Number(req.body.id);

    if (isNaN(id)) {
      throw new ResponseError(400, "Invalid campaign id");
    }

    const oldCampaign = await campaignService.getCampaign(id);

    if (!oldCampaign) {
      throw new ResponseError(404, "Campaign ID not found");
    }

    await moveImageFromTemp(req);

    const body: any = {
      ...req.body,
      categories_id: Number(req.body.categories_id),
      target: Number(req.body.target),
      end_at: new Date(req.body.end_at),
    };

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
          next(err);
        }
      }
      body.thumbnail = newThumbnail;
    } else {
      body.thumbnail = oldCampaign.thumbnail;
    }

    const newStory = req.body.campaign_story;
    const oldStory = oldCampaign.campaign_story!;

    if (newStory && newStory !== oldStory) {
      const oldImages = extractImageFilenames(oldStory);
      const newImages = extractImageFilenames(newStory);

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
            next(err);
          }
        })
      );

      body.campaign_story = newStory;
    } else {
      body.campaign_story = oldStory;
    }

    delete body.id;

    const campaign = await campaignService.update(id, body);

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

const getAllCampaign = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = { ...req.query, page: req.query.page ?? "1" };

    const [campaigns, rowCount] = await campaignService.getAllCampaign(query);

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

const destroy = async (req: Request, res: Response, next: NextFunction) => {};

export default {
  create,
  update,
  getCampaign,
  getAllCampaign,
  isTitleExist,
  uploadCampaignImage,
  destroy,
};
