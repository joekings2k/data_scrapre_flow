"use client";

import React, { useEffect, useState, useTransition } from "react";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
} from "@/components/ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartColumnStackedIcon, Layers2Icon } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { getCreditUsageInPeriods } from "@/actions/analytics/getCreditsUsageInPeriods";
type ChartData = Awaited<ReturnType<typeof getCreditUsageInPeriods>>;
const CreditUsageChart = React.memo(
  function CreditUsageChart({ data,title,desciption }: { data: ChartData,title:string,desciption:string }) {
  const [chartData, setChartData] = useState(data);
  const [isPending, startTransition] = useTransition();
  useEffect(() => {
    if (JSON.stringify(data) !== JSON.stringify(chartData)) {
      startTransition(() => {
        setChartData(data);
      });
    }
  }, [data, chartData]);
  const chartConfig = {
    success: {
      label: "Success",
      color: "hsl(var(--chart-2))",
    },
    failed: {
      label: "Failed",
      color: "hsl(var(--chart-1))",
    },
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <ChartColumnStackedIcon className="w-6 h-6 text-primary" />
          {title}
        </CardTitle>
        <CardDescription>{desciption}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="max-h-[200px] w-full">
          <BarChart
            data={chartData}
            height={200}
            accessibilityLayer
            margin={{ top: 20 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={"date"}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <ChartTooltip
              content={<ChartTooltipContent className="w-[250px]" />}
            />
            <Bar
              radius={[0, 0, 4, 4]}
              dataKey={"success"}
              fill="var(--color-success)"
              fillOpacity={0.6}
              stroke="var(--color-success)"
              stackId={"a"}
            />
            <Bar
              radius={[4, 4, 0, 0]}
              dataKey={"failed"}
              fillOpacity={0.6}
              fill="red"
              stroke="red"
              stackId={"a"}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
})

export default CreditUsageChart;
