import { FlowToExecutionPlan } from "@/lib/workflow/executionPlan"
import { AppNode } from "@/types/appNode"
import { useReactFlow } from "@xyflow/react"
import { useCallback } from "react"

const useExecutionPlan = () => {
  const  {toObject} = useReactFlow()

  const generateExecutionPlan =useCallback( () => {
    const  {nodes:Nodes,edges} = toObject()
    const nodes = Nodes as AppNode[]
    const result = FlowToExecutionPlan(nodes,edges)
    return result
  },[toObject])
  return generateExecutionPlan
}

export default useExecutionPlan