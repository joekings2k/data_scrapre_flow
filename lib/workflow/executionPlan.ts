import { AppNode } from "@/types/appNode";
import { WorkflowExecutionPlan, WorkflowExecutionPlanPhase } from "@/types/workflow";
import { Edge, getIncomers } from "@xyflow/react";
import { TaskRegistry } from "./task/registry";


type FlowToExecutionPlanType = {
  executionPlan?: WorkflowExecutionPlan
};


export function FlowToExecutionPlan(nodes: AppNode[], edges: Edge[]):FlowToExecutionPlanType {
  const getInvalidInputs = (node:AppNode,edges:Edge[],planned:Set<string>)=>{
    return[]
  }
  const entryPoint = nodes.find(node => TaskRegistry[node.data.type].isEntryPoint);
  if (!entryPoint) throw new Error("Not valid Workflow");
  const planned = new Set<string>()
  const executionPlan: WorkflowExecutionPlan = [
    {
      phase: 1,
      nodes: [entryPoint]
    }
  ]
  for (let phase =2; phase<=nodes.length || planned.size < nodes.length ;phase++){
    const nextPhase :WorkflowExecutionPlanPhase ={
      phase,
      nodes:[]
    }
    for (const currentNode of nodes ){
      if(planned.has(currentNode.id)) continue;
      const invalidInputs = getInvalidInputs (currentNode,edges ,planned)
      if(invalidInputs.length > 0){
        const incomers = getIncomers(currentNode,nodes,edges)
        if (incomers.every(incomer=>planned.has(incomer.id))){
          nextPhase.nodes.push(currentNode)
          planned.add(currentNode.id)
        }
      }
    }
  }
  return {executionPlan};
}