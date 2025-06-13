import prisma from "@/lib/prisma";
import { ExecuteWorkflow } from "@/lib/workflow/executeWorkflow";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import {
  ExecutionPhaseStatus,
  WorkflowExcutionStatus,
  WorkflowExecutionPlan,
  WorkflowExecutionTrigger,
} from "@/types/workflow";
import { timingSafeEqual } from "crypto";
import parser from "cron-parser";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

function isValidSecret(secret: string): Boolean {
  const API_SECRET = process.env.API_SECRET;
  if (!API_SECRET) return false;
  try {
    return timingSafeEqual(Buffer.from(secret), Buffer.from(API_SECRET));
  } catch (error) {
    return false;
  }
}

export async function GET(request: Request) {
  console.log("execute workflow");
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return new Response("Unauthorized", { status: 401 });
  }

  const secret = authHeader.split(" ")[1];
  if (!isValidSecret(secret)) {
    return new Response("Unauthorized", { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const workflowId = searchParams.get("workflowId");
  console.log("workflowId", workflowId);
  if (!workflowId) {
    return new Response("Bad Request", { status: 400 });
  }
  const workflow = await prisma.workflow.findUnique({
    where: {
      id: workflowId,
    },
  });
  if (!workflow) {
    return new Response("Not Found", { status: 404 });
  }

  const executionPlan = JSON.parse(
    workflow.executionPlan!
  ) as WorkflowExecutionPlan;
  if (!executionPlan) {
    return new Response("Not Found", { status: 404 });
  }

  try {
    const cron = parser.parseExpression(workflow.cron!, { utc: true });
    const nextRun = cron.next().toDate();
    const execution = await prisma.workflowExecution.create({
      data: {
        workflowId,
        userId: workflow.userId,
        definition: workflow.definition,
        status: WorkflowExcutionStatus.PENDING,
        startedAt: new Date(),
        trigger: WorkflowExecutionTrigger.CRON,
        phases: {
          create: executionPlan.flatMap((phase) => {
            return phase.nodes.flatMap((node) => ({
              userId: workflow.userId,
              status: ExecutionPhaseStatus.CREATED,
              number: phase.phase,
              node: JSON.stringify(node),
              name: TaskRegistry[node.data.type].label,
            }));
          }),
        },
      },
    });
    await ExecuteWorkflow(execution.id, nextRun);
    return Response.json("OK", { status: 200 });
  } catch (error) {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
