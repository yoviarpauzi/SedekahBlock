import prisma from "../config/database";
import { Prisma } from "../../generated/prisma";

const getNews = async (id: number, page: number = 1) => {
  const skip = 10 * (page - 1);
  const take = 10;

  const result = await prisma.$queryRaw<any[]>(Prisma.sql`
  SELECT *, COUNT(*) OVER() AS rowCount
  FROM news
  WHERE campaigns_id = ${id}
  ORDER BY created_at DESC
  LIMIT ${take} OFFSET ${skip}
`);

  const rowCount = result.length > 0 ? Number(result[0].rowcount) : 0;

  const data = result.map(({ rowcount, ...rest }) => rest);

  return {
    data,
    rowCount,
  };
};

const createNews = async (id: number, title: string, body: string) => {
  return await prisma.campaign.update({
    where: {
      id,
    },
    data: {
      news: {
        create: {
          title: title,
          body: body,
        },
      },
    },
  });
};

const updateNews = async (id: number, title: string, body: string) => {
  return await prisma.news.update({
    where: {
      id,
    },
    data: {
      title,
      body,
    },
  });
};

const deleteNews = async (id: number) => {
  return await prisma.news.delete({
    where: {
      id,
    },
  });
};

export default {
  createNews,
  updateNews,
  deleteNews,
  getNews,
};
