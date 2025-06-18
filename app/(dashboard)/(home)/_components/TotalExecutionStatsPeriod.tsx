"use client";
import { getWorkflowExecutionStats } from "@/actions/analytics/getWorkflowExecutionStats";
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
import { Layers2Icon } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { getTotalExecutionStats } from "@/actions/analytics/getTotalExecutionStats";
const colors = ["red", "blue", "hsl(var(--chart-2))", "hsl(var(--chart-4))"];
type ChartData = Awaited<ReturnType<typeof getTotalExecutionStats>>;
const TotalExecutionStatsPeriod = React.memo(
  function TotalExecutionStatsPeriod({ data }: { data: ChartData }) {
    console.log(data);
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
            <Layers2Icon className="w-6 h-6 text-primary" />
            Workflow execution status
          </CardTitle>
          <CardDescription>
            Daily number of successful and failed workflow executions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="max-h-[200px] w-full">
            <PieChart height={200} margin={{ top: 20 }}>
              <ChartLegend content={<ChartLegendContent />} />
              <ChartTooltip
                content={<ChartTooltipContent className="w-[250px]" />}
              />

              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="var(--color-success)"
                label
              >
                {chartData.map((entry, index) => (
                
                    <Cell key={`cell-${index}`} fill={colors[index]} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>
    );
  }
);

export default TotalExecutionStatsPeriod;
