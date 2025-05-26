import { cn } from '@/lib/utils'
import { WorkflowExcutionStatus } from '@/types/workflow'
import React from 'react'

export default function ExecutionStatusIndicator({status}: {status:WorkflowExcutionStatus }) {
  const indicatorColors :Record<WorkflowExcutionStatus,string>= {
    "FAILED":"bg-red-400",
    "PENDING":"bg-slate-400",
    "RUNNING":"bg-yellow-400",
    "COMPLETED":"bg-emerald-600"
  }
  return (
    <p className={cn('w-2 h-2 rounded-full',indicatorColors[status])} />
  )
}

export function ExecutionStatusLabel ({status}: {status:WorkflowExcutionStatus }) {
  const labelColors: Record<WorkflowExcutionStatus, string> = {
    FAILED: "text-red-400",
    PENDING: "text-slate-400",
    RUNNING: "text-yellow-400",
    COMPLETED: "text-emerald-600",
  };
  return (
    <span className={cn("lowercase",labelColors[status])}>{status}</span>
  )
}