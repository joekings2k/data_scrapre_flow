'use client';
import React, { useState } from 'react'
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, AlertDialogAction } from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input';
import { useMutation } from '@tanstack/react-query';
import { deleteWorkflow } from '@/actions/workflows/deleteWorkflow';
import { toast } from 'sonner';

export default function DeleteWorkflowDialogue({open,setOpen,workflowName,workflowId}:{open:boolean,setOpen:React.Dispatch<React.SetStateAction<boolean>>,workflowName:string,workflowId:string}) {
  const [confirmText ,setConfirmText] = useState<string>("")
  const deleteMutation = useMutation({
    mutationFn:deleteWorkflow,
    onSuccess:()=>{
      toast.success("Workflow deleted successfully",{id:workflowId})
      setConfirmText("")
    },
    onError:(error)=>{
      toast.error(error.message,{id:workflowId})
    }
  })
  return (
    <AlertDialog open={open} onOpenChange={setOpen} >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            If you delete this workflow, you will not be able to recover it.
            <div className="flex flex-col py-4 gap-2 ">
              <p>
                if you are sure, enter  <b>{workflowName} to confirm</b>
              </p>
              <Input value={confirmText} onChange={(e)=>setConfirmText(e.target.value)} />
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter  >
          <AlertDialogCancel onClick={()=>setConfirmText("")}>Cancel</AlertDialogCancel>
          <AlertDialogAction className='bg-destructive text-destructive-foreground hover:bg-destructive/90'  disabled={confirmText !== workflowName || deleteMutation.isPending} onClick={() => {
            toast.loading("Deleting workflow",{id:workflowId})
            deleteMutation.mutate(workflowId)
          }} >Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
