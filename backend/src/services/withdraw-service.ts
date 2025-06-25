import prisma from "../config/database";
import { Prisma } from "../../generated/prisma";
import { Decimal } from "@prisma/client/runtime/library";

const create = async (
  campaignId: number,
  amount: number,
  title: string,
  body: string
) => {
  const campaign = await prisma.campaign.findUnique({
    where: {
      id: campaignId,
    },
  });

  const decreaseBalance = campaign?.balance.minus(new Decimal(amount));

  return await prisma.campaign.update({
    where: {
      id: campaignId,
    },
    data: {
      balance: decreaseBalance,
      is_withdraw: true,
      total_withdraw_amount: campaign?.total_withdraw_amount.plus(amount),
      fund_disbursement_histories: {
        create: {
          amount: amount,
          title: title,
          body: body,
        },
      },
    },
  });
};

const update = async (withdrawId: number, title: string, body: string) => {
  return await prisma.fundDisbursementHistories.update({
    where: {
      id: withdrawId,
    },
    data: {
      title,
      body,
    },
  });
};

const destroy = async (withdrawId: number) => {
  return await prisma.fundDisbursementHistories.delete({
    where: {
      id: withdrawId,
    },
  });
};

const getWithdraws = async (campaignId: number, page: number = 1) => {
  const skip = 10 * (page - 1);
  const take = 10;

  const result = await prisma.$queryRaw<any[]>(Prisma.sql`
    SELECT *,
      (SELECT COUNT(*) FROM fund_disbursement_histories WHERE campaigns_id = ${campaignId}) AS rowCount
    FROM fund_disbursement_histories
    WHERE campaigns_id = ${campaignId}
    ORDER BY created_at DESC
    LIMIT ${take} OFFSET ${skip}
  `);

  const rowCount = result.length > 0 ? Number(result[0].rowcount) : 0;
  const data = result.map(({ rowcount, ...rest }) => rest);

  return { data, rowCount };
};

const getWithdrawItem = async (withdrawId: number) => {
  return await prisma.fundDisbursementHistories.findUnique({
    where: {
      id: withdrawId,
    },
  });
};

export default {
  create,
  update,
  destroy,
  getWithdraws,
  getWithdrawItem,
};
