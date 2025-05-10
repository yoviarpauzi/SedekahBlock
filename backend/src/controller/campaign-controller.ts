import { NextFunction, Request, Response } from "express";
import campaignValidation from "../validations/campaign-validation";
import campaignService from "../services/campaign-service";

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validate = campaignValidation.upsert.parse(req.body);

    const campaign = await campaignService.create(validate);

    res.status(201).json({
      status: "success",
      message: "success create campaign",
      data: {
        ...campaign,
      },
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
    const search = req.query?.search?.toString() ?? "";
    const page = Number(req.query.page) || 1;

    const [campaigns, rowCount] = await campaignService.getAllCampaign(
      page,
      search
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
    console.log(title);

    const isExist = await campaignService.isCampaignTitleExist(title);

    res.status(200).json({
      data: isExist,
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
};
