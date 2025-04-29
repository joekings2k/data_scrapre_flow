"use client";
import { Button } from '@/components/ui/button';
import { PlayIcon } from 'lucide-react';
import React from 'react'
import useExecutionPlan from '../../../../hooks/useExecutionPlan';
import { runWorkflow } from '@/actions/workflows/runWorkflow';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import { useReactFlow } from '@xyflow/react';

const ExecuteBtn = ({workflowId}:{workflowId:string}) => {
  const generate  = useExecutionPlan()
  const {toObject} = useReactFlow()
  const mutation = useMutation({
    mutationFn:runWorkflow,
    onSuccess:()=>{
      toast.success("Workflow executed successfully",{id:"flow-execution"})
    },
    onError:(error)=>{
      toast.error(error.message,{id:"flow-execution"})
    }
  })
  return (
    <Button variant={"outline"} className='flex items-center gap-2' onClick ={() => {
      const executionPlan = generate()
      if(!executionPlan){
        return
      }
      toast.loading("Executing workflow",{id:"flow-execution"})
      mutation.mutate({workflowId,flowDefinition:JSON.stringify(toObject())})
    }}>
      <PlayIcon size={16} className='stroke-orange-400' />
      Execute
    </Button>
  )
}

export default ExecuteBtn