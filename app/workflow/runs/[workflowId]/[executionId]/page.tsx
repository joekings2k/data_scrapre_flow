import { getWorkflowExecutionWithPhases } from "@/actions/workflows/getWorkflowExecutionWithPhases";
import TopBar from "@/app/workflow/_components/topbar/TopBar";
import { waitFor } from "@/lib/helper/waitFor";
import { auth } from "@clerk/nextjs/server";
import { Loader2Icon } from "lucide-react";
import React, { Suspense } from "react";
import ExecutionViewer from "./_components/ExecutionViewer";

export default function ExecutionViewerPage({
  params,
}: {
  params: { workflowId: string; executionId: string };
}) {
  return (
    <div className="flex flex-col h-screen w-full overflow-hidden">
       <TopBar
        workflowId={params.workflowId}
        title="Workflow run details"
        subTitle={`Run ID: ${params.executionId}`}
        hideButtons
      /> 
      <section className="flex h-full overflow-auto">
        <Suspense fallback={
          <div className="flex w-full items-center justify-center">
            <Loader2Icon className="h-10 w-10 animate-spin stroke-primary" />
          </div>
        }>
          <ExecutionViewerWrapper  executionId = {params.executionId} />
        </Suspense>
      </section>
    </div>
  );
}



async function ExecutionViewerWrapper({executionId}:{executionId:string}) {
  const { userId } = auth()
  if (!userId) {
    return <div>Unauthenticated</div>;
  }
  const workflowExecution = await getWorkflowExecutionWithPhases(executionId)
  if (!workflowExecution) {
    return <div>Workflow not found</div>;
  }
  return <ExecutionViewer initialData ={workflowExecution} />;
}