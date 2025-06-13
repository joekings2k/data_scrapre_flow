import { getAppUrl } from "@/lib/helper/appUrl";
import prisma from "@/lib/prisma";
import { WorkflowStatus } from "@/types/workflow";
import { Workflow } from "lucide-react";

export async function GET(req:Request) {
  const now = new Date()
  const workflows  = await prisma.workflow.findMany({
    select:{
      id:true,
    },
    where:{
      status:WorkflowStatus.PUBLISHED,
      cron:{not:null},
      nextRunAt:{lte:now}
    }
  })
  console.log("workflows to run",workflows.length)
  for (const workflow of workflows){
    triggerWorkflow(workflow.id)
  }

  return Response.json({workflowsToRun:workflows.length },{status:200})
}

function triggerWorkflow (workflowId:string){
  const triggerApiUrl  = getAppUrl(`api/workflows/execute?workflowId=${workflowId}`)
  console.log("trigger url", triggerApiUrl)
  fetch(triggerApiUrl, {
    next: { revalidate: 0 },
    headers: {
      Authorization: `Bearer ${process.env.API_SECRET!}`,
    },
  }).catch((error) => {
    console.error("Error triggering workflow", error.message);
  });
} 

export const dynamic = 'force-dynamic'