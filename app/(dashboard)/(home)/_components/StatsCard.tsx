import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Icon, LucideIcon } from "lucide-react";
import ReactCountUpWrapper from "@/components/ReactCountUpWrapper";

interface Props {
  title: string;
  value: number;
  icon: LucideIcon;
}
export default function StatsCard({ title, value, icon }: Props) {
  const Icon= icon;
  return (
    <Card className="relative overflow-hidden h-full">
      <CardHeader className="flex pb-2">
        <CardTitle>{title}</CardTitle>
        <Icon size={120} className="text-muted-foreground absolute -bottom-4 -right-8 opacity-10" />
      </CardHeader>
      <CardContent><div className="text-2xl font-bold text-primary">
        <ReactCountUpWrapper  value={value} /></div></CardContent>
    </Card>
  );
}
