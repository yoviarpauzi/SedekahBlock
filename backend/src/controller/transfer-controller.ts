import { NextFunction, Request, Response } from "express";
import transferService from "../services/transfer-service";

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const campaignId = Number(req.params.id);

    const transfer = await transferService.create(
      campaignId,
      req.body.receiver_campaign_id,
      req.body.amount
    );

    res.status(200).json({
      message: "success create transfer",
      transfer,
    });
  } catch (err) {
    next(err);
  }
};

const getTransfers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const campaignId = Number(req.params.id);

    const { data, rowCount } = await transferService.getTransfers(campaignId);

    res.status(200).json({
      message: "success retrieve transfers",
      transfers: data,
      rowCount,
    });
  } catch (err) {
    next(err);
  }
};

const getTransferItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const transferId = Number(req.params.transferId);

    const transfer = await transferService.getTransferItem(transferId);

    res.status(200).json({
      message: "success retrieve transfer item",
      transfer,
    });
  } catch (err) {
    next(err);
  }
};

export default {
  create,
  getTransfers,
  getTransferItem,
};
