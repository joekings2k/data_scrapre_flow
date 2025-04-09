import { TaskParam } from '@/types/task'
import React from 'react'

export function NodeOutputs({
  children
}:{children:React.ReactNode}) {
  return (
    <div className='flex flex-col divide-y gap-1'>{children}</div>
  )
}

export function NodeOutput({output,nodeId}:{output:TaskParam,nodeId:string}) {
  return (
    <div className='flex justify-end relative p-3 bg-secondary '>
      <p className="text-xs text-muted-foreground">
      {output.name}
      </p>
      </div>
  )
}