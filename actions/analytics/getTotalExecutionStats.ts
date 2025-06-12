"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { Period } from "@/types/analytics";
import { PeriodToDateRange } from "@/lib/helper/date";
import { WorkflowExcutionStatus } from "@/types/workflow";

const { COMPLETED, FAILED, PENDING, RUNNING } = WorkflowExcutionStatus;
export async function getTotalExecutionStats(period: Period) {
  const { userId } = auth();
  if (!userId) {
    throw new Error("Unauthenticated");
  }
  const dateRange = PeriodToDateRange(period);
  const executions = await prisma.workflowExecution.findMany({
    where: {
      userId,
      startedAt: { gte: dateRange.startDate, lte: dateRange.endDate },
    },
  });
  

  const executionMap = executions.reduce((acc, execution) => {
    const status = execution.status;
    acc[status] = acc[status] || 0;
    acc[status] += 1;
    return acc;
  }, {} as Record<string, number>);
  const stats = Object.entries(executionMap).map(([status, value]) => {
    return {
      name: WorkflowExcutionStatus[status as WorkflowExcutionStatus] || status,
      value,
    };
  });
 
  return stats;
}
