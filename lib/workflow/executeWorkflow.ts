import prisma from "@/lib/prisma";
import { AppNode } from "@/types/appNode";
import { ExecutionPhaseStatus, WorkflowExcutionStatus } from "@/types/workflow";
import { ExecutionPhase } from "@prisma/client";
import "server-only";
import { TaskRegistry } from "./task/registry";
import { waitFor } from "../helper/waitFor";
import { ExecutorRegistry } from "./executor/registry";
import { Environment, ExecutionEnvironment } from "@/types/executor";
import { TaskParamType } from "@/types/task";
import { Browser, Page } from "puppeteer";
import { revalidatePath } from "next/cache";
import { Edge } from "@xyflow/react";
import { LogCollector } from "@/types/log";
import { log } from "console";
import { createLogCollector } from "../log";
export async function ExecuteWorkflow(executionId: string,nextRunAt?:Date) {
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
  console.log(execution.workflow.definition);
  const edges = JSON.parse(execution.workflow.definition).edges as Edge[];
  const environment: Environment = {
    phases: {},
  };
  await initializeWorkflowExecution(execution.id, execution.workflowId,nextRunAt);
  await initializePhasesStatuses(execution);
  let creditsConsumed = 0;
  let executionFailed = false;

  for (const phase of execution.phases) {
    
    const phaseExecution = await executeWorkflowPhase(
      phase,
      environment,
      edges,
      execution.userId
    );
    creditsConsumed += phaseExecution.creditsConsumed!;
    if (!phaseExecution.success) {
      executionFailed = true;
      break;
    }
    // TODO: execute phase
  }

  await finalizeWorkflowExecution(
    execution.id,
    execution.workflowId,
    executionFailed,
    creditsConsumed
  );
  await cleanupEnvironment(environment);
  revalidatePath("/workflow/runs");
}

async function initializeWorkflowExecution(
  executionId: string,
  workflowId: string,
  nextRunAt?:Date
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
      ...(nextRunAt && {nextRunAt})
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
  await prisma.workflow
    .update({
      where: {
        id: workflowId,
        lastRunId: executionId,
      },
      data: {
        lastRunStatus: fintalStatus,
      },
    })
    .catch((e) => console.log(e));
}

async function executeWorkflowPhase(
  phase: ExecutionPhase,
  environment: Environment,
  edges: Edge[],
  userId:string
) {
  const logCollector: LogCollector = createLogCollector();
  const startedAt = new Date();
  const node = JSON.parse(phase.node) as AppNode;
  setupEnvironmentForPhase(node, environment, edges);
  // update phase status

  await prisma.executionPhase.update({
    where: {
      id: phase.id,
    },
    data: {
      status: ExecutionPhaseStatus.RUNNING,
      startedAt,
      inputs: JSON.stringify(environment.phases[node.id].inputs),
    },
  });
  const creditsRequired = TaskRegistry[node.data.type].credits;
  let success = await decrementCredits(userId, creditsRequired, logCollector);
  const creditsConsumed= success ? creditsRequired : 0;
  if (success) {
    success = await executePhase(phase, node, environment, logCollector);
  }
  // decrement user balance with required credits

  const outputs = environment.phases[node.id].outputs;
  await finalizePhase(phase.id, success, outputs, logCollector ,creditsConsumed);
  return { success,creditsConsumed };
}

async function finalizePhase(
  phaseId: string,
  success: boolean,
  outputs: any,
  logCollector: LogCollector,
  creditsConsumed: number
) {
  const finalStatus = success
    ? ExecutionPhaseStatus.COMPLETED
    : ExecutionPhaseStatus.FAILED;
  await prisma.executionPhase.update({
    where: {
      id: phaseId,
    },
    data: {
      status: finalStatus,
      completedAt: new Date(),
      outputs: JSON.stringify(outputs),
      creditsConsumed,
      logs: {
        createMany: {
          data: logCollector.getAll().map((log) => ({
            message: log.message,
            logLevel: log.level,
            timestamp: log.timestamp,
          })),
        },
      },
    },
  });
}

async function executePhase(
  phase: ExecutionPhase,
  node: AppNode,
  environment: Environment,
  logCollector: LogCollector
): Promise<boolean> {
  const runFn = ExecutorRegistry[node.data.type];
  if (!runFn) {
    throw new Error("Invalid task type");
    return false;
  }
 
  const executionEnvironment: ExecutionEnvironment<any> =
    createExecutionEnvironment(node, environment, logCollector);
  return await runFn(executionEnvironment);
}

function setupEnvironmentForPhase(
  node: AppNode,
  environment: Environment,
  edges: Edge[]
) {
  environment.phases[node.id] = {
    inputs: {},
    outputs: {},
  };
  const inputsDefinition = TaskRegistry[node.data.type].inputs;
  for (const input of inputsDefinition) {
    if (input.type === TaskParamType.BROWSER_INSTANCE) continue;

    const inputValue = node.data.inputs[input.name];

    if (inputValue) {
      environment.phases[node.id].inputs[input.name] = inputValue;
      continue;
    }
    const connectedEdge = edges.find(
      (edge) => edge.target === node.id && edge.targetHandle === input.name
    );
    if (!connectedEdge) {
      console.error(`missing edge for input ${input.name} of node ${node.id}`);
      continue;
    }
    const outputValue =
      environment.phases[connectedEdge.source].outputs[
        connectedEdge.sourceHandle!
      ];
    environment.phases[node.id].inputs[input.name] = outputValue;
  }
}

function createExecutionEnvironment(
  node: AppNode,
  environment: Environment,
  logCollector: LogCollector
): ExecutionEnvironment<any> {
  return {
    getInput: (name: string) => environment.phases[node.id].inputs[name],
    setOutput: (name: string, value: string) => {
      environment.phases[node.id].outputs[name] = value;
    },
    getBrowser: () => environment.browser,
    setBrowser: (browser: Browser) => {
      environment.browser = browser;
    },
    getPage: () => environment.page,
    setPage: (page: Page) => {
      environment.page = page;
    },
    log: logCollector,
  };
}

async function cleanupEnvironment(environment: Environment) {
  if (environment.browser) {
    await environment.browser
      .close()
      .catch((e) => console.error("cannont close browser, Reason:", e));
  }
}

async function decrementCredits(
  userId: string,
  amount: number,
  logCollector: LogCollector
) {
  try {
    await prisma.userBalance.update({
      where: {
        userId,
        credits: { gte: amount },
      },
      data: {
        credits: {
          decrement: amount,
        },
      },
    });
    return true;
  } catch (error) {
    logCollector.error("insufficient balance");
    return false;
  }
}
