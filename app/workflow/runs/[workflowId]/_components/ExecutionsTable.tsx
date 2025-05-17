"use client";
import { getWorkflowExecutions } from "@/actions/workflows/getWorkflowExecutions";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DateToDurationString } from "@/lib/helper/date";
import { Badge } from "@/components/ui/badge";
import ExecutionStatusIndicator from "./ExecutionStatusIndicator";
import { WorkflowExcutionStatus } from "@/types/workflow";
import { CoinsIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
type InitialDataType = Awaited<ReturnType<typeof getWorkflowExecutions>>;
export default function ExecutionsTable({
  workflowId,
  initialData,
}: {
  workflowId: string;
  initialData: InitialDataType;
}) {
  const query = useQuery({
    queryKey: ["executions", workflowId],
    initialData,
    queryFn: () => getWorkflowExecutions(workflowId),
    refetchInterval: 5000,
  });
  const router = useRouter()
  return (
    <div className="border rounded-lg shadow-md overflow-auto">
      <Table className="h-full">
        <TableHeader className="bg-muted">
          <TableRow>
            <TableHead className="text-muted-foreground">ID</TableHead>
            <TableHead className="text-muted-foreground">Status</TableHead>
            <TableHead className="text-muted-foreground">Consumed</TableHead>
            <TableHead className="text-muted-foreground text-right text-xs">
              Started At (desc)
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="h-full overflow-auto gap-2">
          {query.data?.map((execution) => {
            const duration = DateToDurationString(
              execution.completedAt,
              execution.startedAt
            );
            const formattedStartedAt = execution.startedAt && formatDistanceToNow(execution.startedAt,{addSuffix:true})
            return (
              <TableRow key={execution.id} className="h-10" onClick={()=>router.push(`/workflow/runs/${workflowId}/${execution.id}`)}>
                <TableCell className="text-muted-foreground">
                  <div className="flex flex-col">
                    <span className="font-semibold">{execution.id}</span>
                    <div className="text-muted-foreground text-xs">
                      <span>Triggerd via</span>
                      <Badge variant={"outline"}>{execution.trigger}</Badge>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <ExecutionStatusIndicator
                        status={execution.status as WorkflowExcutionStatus}
                      />
                      <span className="font-semibold capitalize">
                        {execution.status}
                      </span>
                    </div>
                    <div className="text-muted-foreground text-xs mx-5">{duration}</div>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <CoinsIcon size={16} className="text-primary" />
                      <span className="font-semibold capitalize">
                        {execution.creditsConsumed}
                      </span>
                    </div>
                    <div className="text-muted-foreground text-xs mx-5">Credits</div>
                  </div>
                </TableCell>
                
                <TableCell className="text-muted-foreground text-right text-xs">
                  {formattedStartedAt}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
