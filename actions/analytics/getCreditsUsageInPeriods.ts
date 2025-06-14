"use server";
import { PeriodToDateRange } from "@/lib/helper/date";
import prisma from "@/lib/prisma";
import { Period } from "@/types/analytics";
import { ExecutionPhaseStatus, WorkflowExcutionStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { eachDayOfInterval, format } from "date-fns";
import { object } from "zod";
type Stats = Record<string, { success: number; failed: number }>;
const { COMPLETED, FAILED } = ExecutionPhaseStatus;
export async function getCreditUsageInPeriods(period: Period) {
  const { userId } = auth();
  if (!userId) {
    throw new Error("Unauthenticated");
  }
  const dateRange = PeriodToDateRange(period);
  const executionPhases = await prisma.executionPhase.findMany({
    where: {
      userId,
      startedAt: { gte: dateRange.startDate, lte: dateRange.endDate },
      status: {
        in: [COMPLETED, FAILED],
      },
    },
  });
  const dateFormat = "yyyy-MM-dd";

  const stats: Stats = eachDayOfInterval({
    start: dateRange.startDate,
    end: dateRange.endDate,
  })
    .map((date) => format(date, dateFormat))
    .reduce((acc, date) => {
      acc[date] = {
        success: 0,
        failed: 0,
      };
      return acc;
    }, {} as any);

  executionPhases.forEach((phase) => {
    const date = format(phase.startedAt!, dateFormat);
    if (phase.status === COMPLETED)
      stats[date].success += phase.creditsConsumed || 0;
    if (phase.status === FAILED)
      stats[date].failed += phase.creditsConsumed || 0;
  });
  const result = Object.entries(stats).map(([date, info]) => ({
    date,
    ...info,
  }));
  return result;
}
