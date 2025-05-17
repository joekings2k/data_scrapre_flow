"use server";

import prisma from "@/lib/prisma";
import { ExecuteWorkflow } from "@/lib/workflow/executeWorkflow";
import { FlowToExecutionPlan } from "@/lib/workflow/executionPlan";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import { ExecutionPhaseStatus, WorkflowExcutionStatus, WorkflowExecutionPlan, WorkflowExecutionTrigger, WorkflowStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function runWorkflow(form:{workflowId:string,flowDefinition?:string}) {
  const {userId} = auth()
  if(!userId){
    throw new Error("Unauthenticated")
  }
  const {workflowId,flowDefinition} = form
  if(!workflowId){
    throw new Error("workflowId is required")
  }
  const workflow = await prisma.workflow.findUnique({
    where:{
      id:workflowId,
      userId
    }
  })
  if (!workflow){
    throw new Error("Workflow not found")
  }
  let executionPlan :WorkflowExecutionPlan
  if(workflow.status === WorkflowStatus.PUBLISHED){
    if(!workflow.executionPlan){
      throw new Error("Workflow execution plan is not defined")
    }
    executionPlan = JSON.parse(workflow.executionPlan!)
  }else {
    if(!flowDefinition){
      throw new Error("flow definition is not defined")
    }
    const flow = JSON.parse(flowDefinition);
    const result = FlowToExecutionPlan(flow.nodes, flow.edges);
    if (result.error) {
      throw new Error("Invalid flow definition");
    }
    if (!result.executionPlan) {
      throw new Error("execution plan failed to generate");
    }
    executionPlan = result.executionPlan!;
  }
  if(!flowDefinition){
    throw  new Error("flow definition is not defined ")
  }
const execution = await prisma.workflowExecution.create({
  data:{
    workflowId,
    userId,
    status:WorkflowExcutionStatus.PENDING,
    startedAt:new Date(),
    trigger:WorkflowExecutionTrigger.MANUAL,
    definition:flowDefinition,
    phases:{
      create: executionPlan.flatMap(phase=>{
        return phase.nodes.flatMap(node=>({
          userId,
          status:ExecutionPhaseStatus.CREATED,
          number:phase.phase,
          node:JSON.stringify(node),
          name:TaskRegistry[node.data.type].label
        }))
      })
    }
    
  },
  select:{
    id:true,
    phases:true
  }
})

if(!execution){
  throw new Error("Failed to create execution")
}
ExecuteWorkflow (execution.id) // run this on background
redirect(`/workflow/runs/${workflowId}/${execution.id}`)
}