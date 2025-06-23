import { Request, Response, NextFunction } from "express";
import path from "path";
import moveImageFromTemp from "../utils/moveImageFromTemp";
import withdrawService from "../services/withdraw-service";
import ResponseError from "../error/response-error";
import prisma from "../config/database";
import extractMatches from "../utils/extractImageFileName";
import fs from "fs/promises";

const regex: RegExp = /\/campaigns\/withdraw\/content\/([^"' ]+)/g;
const urlRegex: RegExp =
  /http?:\/\/[^"' ]+\/campaigns\/withdraw\/content\/([^"' ]+)/g;
const tempDir = path.resolve(__dirname, "./../temp/campaigns/withdraw/content");
const storageDir = path.resolve(
  __dirname,
  "./../storage/campaigns/withdraw/content"
);
const getBaseUrl = (req: Request): string =>
  `${req.protocol}://${req.get("host")}`;

const uploadWithdrawImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) {
      throw new ResponseError(400, "no file uploaded");
    }

    const fileUrl = `${req.protocol}://${req.get(
      "host"
    )}/campaigns/withdraw/content/${req.file.filename}`;

    console.log(fileUrl);
    res.status(200).json({
      message: "success upload image content",
      url: fileUrl,
    });
  } catch (err) {
    next(err);
  }
};

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const campaignId = Number(req.params.id);
    const content = req.body.body;

    await moveImageFromTemp({
      content,
      urlRegex,
      tempDir,
      storageDir,
      baseUrl: getBaseUrl(req),
    });

    const withdraw = await withdrawService.create(
      campaignId,
      req.body.amount,
      req.body.title,
      req.body.body
    );

    res.status(200).json({
      message: "success create withdraw",
      data: withdraw,
    });
  } catch (err) {
    next(err);
  }
};

const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const withdrawId = Number(req.params.withdrawId);
    const withdraw = {
      title: req.body.title,
      body: req.body.body,
    };

    await moveImageFromTemp({
      content: withdraw.body,
      urlRegex,
      tempDir,
      storageDir,
      baseUrl: getBaseUrl(req),
    });

    const oldWithdraw = await withdrawService.getWithdrawItem(withdrawId);

    if (withdraw.body && withdraw.body != oldWithdraw?.body) {
      const oldImages = extractMatches({ content: oldWithdraw?.body, regex });
      const newImages = extractMatches({ content: withdraw.body, regex });

      const removedImages = oldImages.filter((img) => !newImages.includes(img));

      removedImages.map(async (filename) => {
        const filePath = path.resolve(
          __dirname,
          `../storage/campaigns/withdraw/content/${filename}`
        );
        try {
          await fs.unlink(filePath);
        } catch (err) {
          throw err;
        }
      });
    } else {
      withdraw.body = oldWithdraw?.body;
    }

    const data = await withdrawService.update(
      withdrawId,
      withdraw.title,
      withdraw.body
    );

    res.status(200).json({
      message: "success update withdraw",
      withdraw: data,
    });
  } catch (err) {
    next(err);
  }
};

const destroy = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const withdrawId = Number(req.params.withdrawId);
    const withdraw = await withdrawService.getWithdrawItem(withdrawId);

    if (!withdraw) {
      throw new ResponseError(404, "withdraw id not found");
    }

    const imageFilenames = extractMatches({
      content: withdraw.body,
      regex,
    });

    imageFilenames.map(async (filename) => {
      const imagePath = path.resolve(
        __dirname,
        `../storage/campaigns/withdraw/content/${filename}`
      );
      try {
        await fs.unlink(imagePath);
      } catch (err) {
        throw err;
      }
    });

    await withdrawService.destroy(withdrawId);

    res.status(200).json({
      message: "success delete withdraw",
    });
  } catch (err) {
    next(err);
  }
};

const getWithdraws = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const campaignId = Number(req.params.id);
    const pageQuery = req.query.page ?? "1";
    const page = Number(pageQuery);

    const campaign = await prisma.campaign.findUnique({
      where: {
        id: campaignId,
      },
    });

    if (!campaign) {
      throw new ResponseError(404, "campaign id not found");
    }

    const { data, rowCount } = await withdrawService.getWithdraws(
      campaignId,
      page
    );

    res.status(200).json({
      message: "success retrieve news",
      fundDisbursement: data,
      rowCount,
    });
  } catch (err) {
    next(err);
  }
};

const getWithdrawItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const withdrawId = Number(req.params.withdrawId);

    const withdraw = await withdrawService.getWithdrawItem(withdrawId);

    if (!withdraw) {
      throw new ResponseError(404, "withdraw id not found");
    }

    res.status(200).json({
      message: "success retrieve withdraw",
      withdraw,
    });
  } catch (err) {
    next(err);
  }
};

export default {
  uploadWithdrawImage,
  create,
  update,
  destroy,
  getWithdraws,
  getWithdrawItem,
};
