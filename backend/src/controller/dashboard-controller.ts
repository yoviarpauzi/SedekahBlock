import { NextFunction, Request, Response } from "express";
import { Prisma } from "../../generated/prisma";
import prisma from "../config/database";

const index = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dashboardData = await prisma.$queryRaw<
      {
        user_count: number;
        category_count: number;
        campaigns_count: number;
        active_campaigns_count: number;
        total_donation_distributed: number;
        monthly_donations: {
          month: string;
          total_amount: number;
          donation_count: number;
        }[];
      }[]
    >(Prisma.sql`
      SELECT
        (SELECT COUNT(*) FROM "users") AS user_count,
        (SELECT COUNT(*) FROM "categories") AS category_count,
        (SELECT COUNT(*) FROM "campaigns" ) AS campaigns_count,
        (SELECT COUNT(*) FROM "campaigns" WHERE is_active = true AND end_at > NOW()) AS active_campaigns_count,
        (SELECT COALESCE(SUM(amount), 0) FROM "fund_disbursement_histories") AS total_donation_distributed,
        (SELECT JSON_AGG(
          JSON_BUILD_OBJECT(
            'month', month_name,
            'total_amount', COALESCE(total_amount, 0),
            'donation_count', COALESCE(donation_count, 0)
          ) ORDER BY month_num
        ) FROM (
          SELECT 
            month_num,
            month_name,
            SUM(amount) as total_amount,
            COUNT(*) as donation_count
          FROM (
            SELECT 1 as month_num, 'Januari' as month_name, NULL::numeric as amount WHERE FALSE
            UNION ALL SELECT 2, 'Februari', NULL WHERE FALSE
            UNION ALL SELECT 3, 'Maret', NULL WHERE FALSE
            UNION ALL SELECT 4, 'April', NULL WHERE FALSE
            UNION ALL SELECT 5, 'Mei', NULL WHERE FALSE
            UNION ALL SELECT 6, 'Juni', NULL WHERE FALSE
            UNION ALL SELECT 7, 'Juli', NULL WHERE FALSE
            UNION ALL SELECT 8, 'Agustus', NULL WHERE FALSE
            UNION ALL SELECT 9, 'September', NULL WHERE FALSE
            UNION ALL SELECT 10, 'Oktober', NULL WHERE FALSE
            UNION ALL SELECT 11, 'November', NULL WHERE FALSE
            UNION ALL SELECT 12, 'Desember', NULL WHERE FALSE
            UNION ALL
            SELECT 
              EXTRACT(MONTH FROM created_at)::integer as month_num,
              CASE EXTRACT(MONTH FROM created_at)
                WHEN 1 THEN 'Januari'
                WHEN 2 THEN 'Februari'
                WHEN 3 THEN 'Maret'
                WHEN 4 THEN 'April'
                WHEN 5 THEN 'Mei'
                WHEN 6 THEN 'Juni'
                WHEN 7 THEN 'Juli'
                WHEN 8 THEN 'Agustus'
                WHEN 9 THEN 'September'
                WHEN 10 THEN 'Oktober'
                WHEN 11 THEN 'November'
                WHEN 12 THEN 'Desember'
              END as month_name,
              amount
            FROM "donation_histories" 
            WHERE EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM NOW())
          ) months_data
          GROUP BY month_num, month_name
        ) monthly_summary) AS monthly_donations
    `);

    const data = dashboardData[0];

    const result = {
      user_count: Number(data.user_count),
      category_count: Number(data.category_count),
      campaigns_count: Number(data.campaigns_count),
      active_campaigns_count: Number(data.active_campaigns_count),
      total_donation_distributed: Number(data.total_donation_distributed),
      monthly_donation: data.monthly_donations,
    };

    console.log(result);

    res.status(200).json({
      message: "success retrieve data for dashboard",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export default { index };
