"use client";
import { Button } from '@/components/ui/button';
import { PlayIcon, UploadIcon } from 'lucide-react';
import React from 'react'
import useExecutionPlan from '../../../../hooks/useExecutionPlan';
import { runWorkflow } from '@/actions/workflows/runWorkflow';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import { useReactFlow } from '@xyflow/react';
import { PublishWorkflow } from '@/actions/workflows/publishWorkflow';

const UnPublishBtn = ({workflowId}:{workflowId:string}) => {
  const generate  = useExecutionPlan()
  const {toObject} = useReactFlow()
  const mutation = useMutation({
    mutationFn:PublishWorkflow,
    onSuccess:()=>{
      toast.success("Workflow published",{id:workflowId})
    },
    onError:(error)=>{
      toast.error(error.message,{id:workflowId})
    }
  })

  return (
    <Button variant={"outline"} className='flex items-center gap-2' onClick ={() => {
      const executionPlan = generate()
      if(!executionPlan){
        return
      }
      toast.loading("Executing workflow",{id:"flow-execution"})
      mutation.mutate({id:workflowId,flowDefinition:JSON.stringify(toObject())})
    }}>
      <UploadIcon size={16} className='stroke-green-400' />
      Publish
    </Button>
  )
}

export default UnPublishBtn