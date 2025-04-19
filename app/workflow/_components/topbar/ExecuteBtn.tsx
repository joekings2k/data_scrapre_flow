"use client";
import { Button } from '@/components/ui/button';
import { PlayIcon } from 'lucide-react';
import React from 'react'
import useExecutionPlan from '../../../../hooks/useExecutionPlan';

const ExecuteBtn = ({workflowId}:{workflowId:string}) => {
  const generate  = useExecutionPlan()
  return (
    <Button variant={"outline"} className='flex items-center gap-2' onClick ={() => {
      const executionPlan = generate()
      console.table(executionPlan)
    }}>
      <PlayIcon size={16} className='stroke-orange-400' />
      Execute
    </Button>
  )
}

export default ExecuteBtn