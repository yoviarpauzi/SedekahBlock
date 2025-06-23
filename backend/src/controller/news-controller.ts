import { Request, Response, NextFunction } from "express";
import ResponseError from "../error/response-error";
import path from "path";
import moveImageFromTemp from "../utils/moveImageFromTemp";
import prisma from "../config/database";
import extractMatches from "../utils/extractImageFileName";
import fs from "fs/promises";
import newsService from "../services/news-service";

const getBaseUrl = (req: Request): string =>
  `${req.protocol}://${req.get("host")}`;

const regex: RegExp = /\/campaigns\/news\/content\/([^"' ]+)/g;
const urlRegex: RegExp =
  /http?:\/\/[^"' ]+\/campaigns\/news\/content\/([^"' ]+)/g;
const tempDir = path.resolve(__dirname, "./../temp/campaigns/news/content");
const storageDir = path.resolve(
  __dirname,
  "./../storage/campaigns/news/content"
);

const uploadNewsImage = async (
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
    )}/campaigns/news/content/${req.file.filename}`;

    res.status(200).json({
      message: "success upload image content",
      url: fileUrl,
    });
  } catch (err) {
    next(err);
  }
};

const create = async (req: Request, res: Response, next: NextFunction) => {
  const campaignId = Number(req.params.id);
  const content = req.body.body;

  await moveImageFromTemp({
    content,
    urlRegex,
    tempDir,
    storageDir,
    baseUrl: getBaseUrl(req),
  });

  const campaign = await prisma.campaign.findUnique({
    where: {
      id: campaignId,
    },
  });

  if (!campaign) {
    throw new ResponseError(404, "campaign id not found!");
  }

  const news = await newsService.createNews(
    campaignId,
    req.body.title,
    req.body.body
  );

  res.status(200).json({
    message: "success create news",
    news,
  });
};

const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const news = {
      title: req.body.title,
      body: req.body.body,
    };
    const newsId = Number(req.params.newsId);

    await moveImageFromTemp({
      content: news.body,
      urlRegex,
      tempDir,
      storageDir,
      baseUrl: getBaseUrl(req),
    });

    const oldNews = await prisma.news.findUnique({
      where: {
        id: newsId,
      },
    });

    if (news.body && news.body !== oldNews?.body) {
      const oldImages = extractMatches({ content: oldNews?.body, regex });
      const newImages = extractMatches({ content: news.body, regex });

      const removedImages = oldImages.filter((img) => !newImages.includes(img));

      removedImages.map(async (filename) => {
        const filePath = path.resolve(
          __dirname,
          `../storage/campaigns/news/content/${filename}`
        );
        try {
          await fs.unlink(filePath);
        } catch (err) {
          throw err;
        }
      });
    } else {
      news.body = oldNews?.body;
    }

    const campaign: any = await newsService.updateNews(
      newsId,
      news.title,
      news.body
    );

    res.status(200).json({
      message: "success update data",
      data: campaign,
    });
  } catch (err) {
    next(err);
  }
};

const destroy = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newsId = Number(req.params.id);
    const regex = /\/campaigns\/news\/content\/([^"' ]+)/g;

    const news = await prisma.news.findUnique({
      where: {
        id: newsId,
      },
    });

    if (!news) {
      throw new ResponseError(404, "news id not found");
    }

    const imageFilenames = extractMatches({
      content: news.body,
      regex,
    });

    imageFilenames.map(async (filename) => {
      const imagePath = path.resolve(
        __dirname,
        `../storage/campaigns/news/content/${filename}`
      );
      try {
        await fs.unlink(imagePath);
      } catch (err) {
        throw err;
      }
    });

    await newsService.deleteNews(newsId);

    res.status(200).json({
      message: "success delete news",
    });
  } catch (err) {
    next(err);
  }
};

const getNews = async (req: Request, res: Response, next: NextFunction) => {
  const paramsId = Number(req.params.id);
  const pageQuery = req.query.page ?? "1";
  const page = Number(pageQuery);

  const campaign = await prisma.campaign.findUnique({
    where: {
      id: Number(paramsId),
    },
  });

  if (!campaign) {
    throw new ResponseError(404, "campaign id not found");
  }

  const { data, rowCount } = await newsService.getNews(paramsId, page);

  res.status(200).json({
    message: "success retrieve news",
    news: data,
    rowCount: rowCount,
  });
};

const getNewsItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newsId = Number(req.params.id);

    const news = await prisma.news.findUnique({
      where: {
        id: newsId,
      },
    });

    if (!news) {
      throw new ResponseError(404, "news id not found");
    }

    res.status(200).json({
      message: "success retrieve news",
      news,
    });
  } catch (err) {
    next(err);
  }
};

export default {
  uploadNewsImage,
  create,
  update,
  destroy,
  getNews,
  getNewsItem,
};
