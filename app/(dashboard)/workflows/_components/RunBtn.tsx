import { runWorkflow } from '@/actions/workflows/runWorkflow'
import { Button } from '@/components/ui/button'
import { useMutation } from '@tanstack/react-query'
import { PlayIcon } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'

const RunBtn = ({workflowId}:{workflowId:string}) => {
  const mutation = useMutation({
    mutationFn:runWorkflow,
    onSuccess:()=>{
      toast.success("Workflow executed successfully",{id:workflowId})
    },
    onError:(error)=>{
      toast.error(error.message,{id:workflowId})
    }
  })
  return (
    <Button variant={"outline"} size={'sm'} className='flex items-center gap-2' disabled={mutation.isPending} onClick={() => {
      toast.loading("Scheduling run ...",{id:workflowId})
      mutation.mutate({workflowId})
    }}>

      <PlayIcon size={16} className='stroke-orange-400' />
      Run
    </Button>
  )
}

export default RunBtn