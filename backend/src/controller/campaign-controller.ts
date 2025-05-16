import { NextFunction, Request, Response } from "express";
import campaignValidation from "../validations/campaign-validation";
import campaignService from "../services/campaign-service";
import ResponseError from "../error/response-error";
import path from "path";
import fs from "fs";

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const urlRegex = /http?:\/\/[^"' ]+\/campaign\/content\/([^"' ]+)/g;
    const tempDir = path.resolve(__dirname, "./../temp/campaign/content");
    const storageDir = path.resolve(__dirname, "./../storage/campaign/content");

    const filenamesToMove = new Set<string>();
    let match;
    while ((match = urlRegex.exec(req.body.campaign_story)) !== null) {
      filenamesToMove.add(match[1]);
    }

    if (!fs.existsSync(storageDir)) {
      fs.mkdirSync(storageDir, { recursive: true });
    }

    filenamesToMove.forEach((filename) => {
      const tempPath = path.join(tempDir, filename);
      const storagePath = path.join(storageDir, filename);

      if (fs.existsSync(tempPath)) {
        fs.renameSync(tempPath, storagePath);

        const tempUrl = `${req.protocol}://${req.get(
          "host"
        )}/campaign/content/${filename}`;
        req.body.campaign_story = req.body.campaign_story.replace(
          new RegExp(tempUrl, "g"),
          tempUrl
        );
      }
    });

    const thumbnail = `campaign/thumbnail/${req.file?.filename}`;

    const body = {
      ...req.body,
      categories_id: Number(req.body.categories_id),
      target: Number(req.body.target),
      end_at: new Date(req.body.end_at),
      thumbnail: thumbnail,
    };

    const campaign = campaignService.create(body);

    res.status(200).json({
      message: "success",
    });
  } catch (err) {
    next(err);
  }
};

const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    const validate = campaignValidation.upsert.parse(req.body);

    const campaign = await campaignService.update(id, validate);

    res.status(200).json({
      status: "success",
      message: "success update data",
      data: {
        ...campaign,
      },
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
      status: "success",
      message: "success retrieve data",
      data: {
        ...campaign,
      },
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
    const search = req.query?.search?.toString() || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    const [campaigns, rowCount] = await campaignService.getAllCampaign(
      page,
      search,
      limit
    );

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

    const filename = req.file.filename;

    const fileUrl = `${req.protocol}://${req.get(
      "host"
    )}/campaign/content/${filename}`;

    res.status(200).json({
      message: "success upload image content",
      url: fileUrl,
    });
  } catch (err) {
    next(err);
  }
};

export default {
  create,
  update,
  getCampaign,
  getAllCampaign,
  isTitleExist,
  uploadCampaignImage,
};
