import { error } from "console";
import { Prisma } from "../../generated/prisma";
import { Decimal } from "../../generated/prisma/runtime/library";
import prisma from "../config/database";
import campaignService from "./campaign-service";

const create = async (
  campaignId: number,
  receiver_campaign_id: number,
  amount: number
) => {
  try {
    const campaign = await prisma.campaign.findUnique({
      where: {
        id: campaignId,
      },
    });

    const receiverCampaign = await prisma.campaign.findUnique({
      where: {
        id: receiver_campaign_id,
      },
    });

    const increaseCollected = receiverCampaign?.collected.plus(
      new Decimal(amount)
    );

    const isEligible = increaseCollected!.greaterThanOrEqualTo(1);

    const updateBalance: Decimal = isEligible
      ? increaseCollected!
          .mul(0.95)
          .minus(receiverCampaign!.total_withdraw_amount)
      : receiverCampaign!.balance.plus(new Decimal(amount));

    const updateOperationalCosts: Decimal = isEligible
      ? increaseCollected!.mul(0.05)
      : receiverCampaign!.operational_costs;

    const decreaseBalance = campaign?.balance.lessThanOrEqualTo(
      new Decimal(amount)
    )
      ? Decimal(0)
      : campaign?.balance.minus(new Decimal(amount));
    const decreaseOperationalCosts = campaign?.balance.lessThan(
      new Decimal(amount)
    )
      ? campaign?.operational_costs.minus(new Decimal(amount))
      : campaign?.operational_costs;

    await prisma.campaign.update({
      where: {
        id: campaignId,
      },
      data: {
        balance: decreaseBalance,
        operational_costs: decreaseOperationalCosts,
        is_transfer: true,
        transfer_histories: {
          create: {
            receiver_campaign_id: receiver_campaign_id,
            amount: new Decimal(amount),
          },
        },
      },
    });

    await prisma.campaign.update({
      where: {
        id: receiver_campaign_id,
      },
      data: {
        collected: increaseCollected,
        balance: updateBalance,
        operational_costs: updateOperationalCosts,
      },
    });
  } catch (err) {
    throw err;
  }
};

const getTransfers = async (campaignId: number, page: number = 1) => {
  try {
    const skip = 10 * (page - 1);
    const take = 10;

    const result = await prisma.$queryRaw<any[]>(Prisma.sql`
        SELECT *, COUNT(*) OVER() AS rowCount
        FROM transfer_histories
        WHERE campaigns_id = ${campaignId}
        ORDER BY created_at DESC
        LIMIT ${take} OFFSET ${skip}
    `);

    const rowCount = result.length > 0 ? Number(result[0].rowcount) : 0;

    const data = result.map(({ rowcount, ...rest }) => rest);

    return {
      data,
      rowCount,
    };
  } catch (err) {
    throw err;
  }
};

const getTransferItem = async (transferId: number) => {
  try {
    return await prisma.transferHistories.findUnique({
      where: {
        id: transferId,
      },
    });
  } catch (err) {
    throw err;
  }
};

export default {
  create,
  getTransfers,
  getTransferItem,
};
