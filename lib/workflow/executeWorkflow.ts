import prisma from "@/lib/prisma";
import { AppNode } from "@/types/appNode";
import { ExecutionPhaseStatus, WorkflowExcutionStatus } from "@/types/workflow";
import { ExecutionPhase } from "@prisma/client";
import "server-only";
import { TaskRegistry } from "./task/registry";
import { waitFor } from "../helper/waitFor";
import { ExecutorRegistry } from "./executor/registry";
export async function ExecuteWorkflow(executionId: string) {
  const execution = await prisma.workflowExecution.findUnique({
    where: {
      id: executionId,
    },
    include: {
      workflow: true,
      phases: true,
    },
  });
  if (!execution) {
    throw new Error("execution not found");
  }

  const environment = {
    phases: {},
  };
  await initializeWorkflowExecution(execution.id, execution.workflowId);
  await initializePhasesStatuses(execution);
  let creditsConsumed = 0;
  let executionFailed = false;
  for (const phase of execution.phases) {
    // consumeCredits
    const phaseExecution = await executeWorkflowPhase(phase);
    if(!phaseExecution.success){
      executionFailed = true
      break
    }
    // TODO: execute phase
  }

  await finalizeWorkflowExecution(
    execution.id,
    execution.workflowId,
    executionFailed,
    creditsConsumed
  );
}

async function initializeWorkflowExecution(
  executionId: string,
  workflowId: string
) {
  await prisma.workflowExecution.update({
    where: {
      id: executionId,
    },
    data: {
      status: WorkflowExcutionStatus.RUNNING,
      startedAt: new Date(),
    },
  });

  await prisma.workflow.update({
    where: {
      id: workflowId,
    },
    data: {
      lastRunAt: new Date(),
      lastRunId: executionId,
      lastRunStatus: WorkflowExcutionStatus.RUNNING,
    },
  });
}

async function initializePhasesStatuses(execution: any) {
  await prisma.executionPhase.updateMany({
    where: {
      id: {
        in: execution.phases.map((phase: any) => phase.id),
      },
    },
    data: {
      status: ExecutionPhaseStatus.PENDING,
    },
  });
}

async function finalizeWorkflowExecution(
  executionId: string,
  workflowId: string,
  executionFailed: boolean,
  creditsConsumed: number
) {
  const fintalStatus = executionFailed
    ? WorkflowExcutionStatus.FAILED
    : WorkflowExcutionStatus.COMPLETED;
  await prisma.workflowExecution.update({
    where: {
      id: executionId,
    },
    data: {
      status: fintalStatus,
      completedAt: new Date(),
      creditsConsumed,
    },
  });
  await prisma.workflow.update({
    where: {
      id: workflowId,
      lastRunId: executionId,
    },
    data: {
      lastRunStatus: fintalStatus,
    },
  }).catch(e=>console.log(e)) 
}

async function executeWorkflowPhase(phase: ExecutionPhase) {
  const startedAt = new Date();
  const node  = JSON.parse(phase.node) as AppNode

  // update phase status 

  await prisma.executionPhase.update({
    where: {
      id: phase.id,
    },
    data: {
      status: ExecutionPhaseStatus.RUNNING,
      startedAt,
    },
  });
  const creditsRequired = TaskRegistry[node.data.type].credits;
  console.log('execution phase:',phase?.name,"with",creditsRequired,"credits")
  // decrement user balance with required credits
  const success = await executePhase(phase,node)
  await finalizePhase (phase.id,success)
  return {success}
}

async function finalizePhase(phaseId:string,success:boolean){
  const finalStatus = success ? ExecutionPhaseStatus.COMPLETED : ExecutionPhaseStatus.FAILED
  await prisma.executionPhase.update({
    where: {
      id: phaseId,
    },
    data: {
      status: finalStatus,
      completedAt: new Date(),
    },
  });
}


async function executePhase(phase: ExecutionPhase,node:AppNode):Promise<boolean> {
  const runFn = ExecutorRegistry[node.data.type]
  if(!runFn){
    throw new Error("Invalid task type")
    return false
  }
  
  return await runFn()
}