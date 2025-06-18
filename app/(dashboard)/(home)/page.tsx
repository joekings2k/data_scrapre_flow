import { getPeriods } from "@/actions/analytics/getPeriods";
import React, { Suspense } from "react";
import PeriodSelector from "./_components/PeriodSelector";
import { Period } from "@/types/analytics";
import { Skeleton } from "@/components/ui/skeleton";
import { getStatsCardsValues } from "@/actions/analytics/getStatsCardsValues";
import { CirclePlayIcon, CoinsIcon, WaypointsIcon } from "lucide-react";
import StatsCard from "./_components/StatsCard";
import { waitFor } from "@/lib/helper/waitFor";
import { getWorkflowExecutionStats } from "@/actions/analytics/getWorkflowExecutionStats";
import ExecutionStatusChart from "./_components/ExecutionStatusChart";
import CreditUsageChart from "../billing/_components/CreditUsageChart";
import { getTotalExecutionStats } from "@/actions/analytics/getTotalExecutionStats";
import TotalExecutionStatsPeriod from "./_components/TotalExecutionStatsPeriod";

function HomePage({
  searchParams,
}: {
  searchParams: { month?: string; year?: string };
}) {
  const currentDate = new Date();
  const { month, year } = searchParams;

  const period: Period = {
    month: month ? parseInt(month) : currentDate.getMonth(),
    year: year ? parseInt(year) : currentDate.getFullYear(),
  };
  return (
    <div className="flex flex-col flex-1 h-full">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Home</h1>
        <Suspense
          fallback={<Skeleton className="w-[180px] h-[40px]"></Skeleton>}
        >
          <PeriodSelectorWrapper selectedPeriod={period} />
        </Suspense>
      </div>
      <div className="h-full py-6 flex flex-col gap-4">
        <Suspense fallback={<StatsCardSkeleton />}>
          <StatsCards selectedPeriod={period} />
        </Suspense>
        <Suspense fallback={<Skeleton className="w-full h-[300px]" />}>
          <StatsExecutionStatus selectedPeriod={period} />
        </Suspense>
        <Suspense fallback={<Skeleton className="w-full h-[300px]" />}>
          <CreditsUsageInPeriod selectedPeriod={period} />
        </Suspense>
        <Suspense fallback={<Skeleton className="w-full h-[300px]" />}>
          <GetTotalExecutionStats selectedPeriod={period} />
        </Suspense>
      </div>
    </div>
  );
}

async function PeriodSelectorWrapper({
  selectedPeriod,
}: {
  selectedPeriod: Period;
}) {
  const periods = await getPeriods();
  return <PeriodSelector periods={periods} selectedPeriod={selectedPeriod} />;
}

async function StatsCards({ selectedPeriod }: { selectedPeriod: Period }) {
  const data = await getStatsCardsValues(selectedPeriod);
  console.log(data);
  return (
    <div className=" grid gap-3 lg:gap-8 lg:grid-cols-3 min-h-[120px]">
      <StatsCard
        title="Workflow executions"
        value={data.stats.workflowExecutions}
        icon={CirclePlayIcon}
      />
      <StatsCard
        title="Phase executions"
        value={data.stats.phaseExecutions}
        icon={WaypointsIcon}
      />
      <StatsCard
        title="Credits consumed"
        value={data.stats.creditsConsumed}
        icon={CoinsIcon}
      />
    </div>
  );
}

function StatsCardSkeleton() {
  return (
    <div className=" grid gap-3 lg:gap-8 lg:grid-cols-3 min-h-[120px]">
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="w-full h-[120px] rounded-md" />
      ))}
    </div>
  );
}

async function StatsExecutionStatus({
  selectedPeriod,
}: {
  selectedPeriod: Period;
}) {
  const data = await getWorkflowExecutionStats(selectedPeriod);
  return <ExecutionStatusChart data={data} />;
}
async function CreditsUsageInPeriod({
  selectedPeriod,
}: {
  selectedPeriod: Period;
}) {
  const data = await getWorkflowExecutionStats(selectedPeriod);
  return (
    <CreditUsageChart
      data={data}
      title="Daily credits spent"
      desciption="Daily credits spent in a selected period"
    />
  );
}

async function GetTotalExecutionStats({
  selectedPeriod,
}: {
  selectedPeriod: Period;
}) {
  const data = await getTotalExecutionStats(selectedPeriod);
  return <TotalExecutionStatsPeriod data={data} />;
}

export default HomePage;
