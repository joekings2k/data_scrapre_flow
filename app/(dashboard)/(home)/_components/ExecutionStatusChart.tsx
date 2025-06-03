"use client";
import { getWorkflowExecutionStats } from "@/actions/analytics/getWorkflowExecutionStats";
import React from "react";
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
import { Layers2Icon } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
type ChartData = Awaited<ReturnType<typeof getWorkflowExecutionStats>>;
function ExecutionStatusChart({ data }: { data: ChartData }) {
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
          <Layers2Icon className="w-6 h-6 text-primary" />
          Workflow execution status
        </CardTitle>
        <CardDescription>
          Daily number of successful and failed workflow executions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="max-h-[200px] w-full">
          <AreaChart
            data={data}
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
            <Area
              min={0}
              type={"bump"}
              dataKey={"success"}
              fill="var(--color-success)"
              fillOpacity={0.6}
              stroke="var(--color-success)"
              stackId={"a"}
            />
            <Area
              dataKey={"failed"}
              min={0}
              type={"bump"}
              fillOpacity={0.6}
              fill="red"
              stroke="red"
              stackId={"a"}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export default ExecutionStatusChart;
