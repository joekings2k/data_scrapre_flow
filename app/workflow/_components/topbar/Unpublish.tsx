"use client";
import { Button } from '@/components/ui/button';
import { DownloadIcon, PlayIcon, UploadIcon } from 'lucide-react';
import React from 'react'
import useExecutionPlan from '../../../../hooks/useExecutionPlan';
import { runWorkflow } from '@/actions/workflows/runWorkflow';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import { useReactFlow } from '@xyflow/react';
import { PublishWorkflow } from '@/actions/workflows/publishWorkflow';
import { unpublishWorkflow } from '@/actions/workflows/unpublishWorkflow';

const UnPublishBtn = ({workflowId}:{workflowId:string}) => {
  const generate  = useExecutionPlan()
  const {toObject} = useReactFlow()
  const mutation = useMutation({
    mutationFn:unpublishWorkflow,
    onSuccess:()=>{
      toast.success("Workflow Unpublished",{id:workflowId})
    },
    onError:(error)=>{
      toast.error(error.message,{id:workflowId})
    }
  })

  return (
    <Button variant={"outline"} className='flex items-center gap-2' onClick ={() => {
     
      toast.loading("UnPublishing workflow...",{id:workflowId})
      mutation.mutate(workflowId)
    }}>
      <DownloadIcon size={16} className='stroke-orange-500' />
      UnPublish
    </Button>
  )
}

export default UnPublishBtn