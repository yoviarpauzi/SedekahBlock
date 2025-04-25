import { NextFunction, Request, Response } from "express";
import campaignValidation from "../validations/campaign-validation";
import campaignService from "../services/campaign-service";

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validate = campaignValidation.upsert.parse(req.body);

    const campaign = await campaignService.create(validate);

    res.status(200).json({
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
    const id = BigInt(req.params.id);
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
    const id = BigInt(req.params.id);

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

export default {
  create,
  update,
  getCampaign,
};
