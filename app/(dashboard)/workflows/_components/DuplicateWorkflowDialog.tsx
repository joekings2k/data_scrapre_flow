'use client';
import React, { useCallback } from 'react'
import { Dialog,DialogContent,DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import CustomDialogHeader from '@/components/CustomDialogHeader';
import { CopyIcon, Layers2Icon, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { createWorkflowSchema, CreateWorkflowSchemaType, duplicateWorkflowSchema, DuplicateWorkflowSchemaType } from '@/schema/workflow';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useMutation } from '@tanstack/react-query';
import { createWorkflow } from '@/actions/workflows/createWorkflow';
import { toast } from 'sonner';
import { duplicateWorkflow } from '@/actions/workflows/duplicateWorkflow';
import { cn } from '@/lib/utils';

const DuplicateWorkflowDialog = ({workflowId}:{workflowId?:string}) => {
  const [open, setOpen] = React.useState(false)
  const form = useForm<DuplicateWorkflowSchemaType>(
    { resolver: zodResolver(duplicateWorkflowSchema),defaultValues:{workflowId,} }
  )
  const{mutate,isPending}= useMutation(
    {
      mutationFn:duplicateWorkflow,
      onSuccess:()=>{
        toast.success("Workflow created successfully",{id:"duplicate-workflow"})
        setOpen((prev)=>!prev)
      },
      onError:(error)=>{
        toast.error(error.message,{id:"duplicate-workflow"})
      }
    }
  )
  const onSubmit = useCallback((values:DuplicateWorkflowSchemaType)=>{
    toast.loading("Duplicating workflow",{id:"duplicate-workflow"})
    mutate(values)
  },[mutate])
  return (
    <Dialog open={open} onOpenChange={(open)=>{
      form.reset()
      setOpen(open)
    }}>
      <DialogTrigger asChild>
        <Button variant={"ghost"} size={"icon"} className={cn("ml-2 transition-opacity duration-200 opacity-0 group-hover/card:opacity-100")}> 
        <CopyIcon className='w-4 h-4 text-muted-foreground cursor-pointer ' /></Button>
      </DialogTrigger>
      <DialogContent className="px-0">
        <CustomDialogHeader
          title="Duplicate Workflow"
          icon={Layers2Icon}
        />
        <div className="p-6 ">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 w-full"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <p className="text-xs text-primary">(required)</p>
                    <FormControl>
                      <Input placeholder="Name" {...field} />
                    </FormControl>
                    <FormDescription>
                      Choose a desciptive and unique name
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Desciption</FormLabel>
                    <p className="text-xs text-muted-foreground">(optional)</p>
                    <FormControl>
                      <Textarea placeholder="Description" className='resize-none' {...field} />
                    </FormControl>
                    <FormDescription>
                     Provide a brief description of your workflow.
                    </FormDescription>
                    <FormDescription>
                     This is optional but can help others understand your workflow.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type={"submit"} className='w-full' disabled={isPending}>
                {!isPending && "Proceed"}
                {
                  isPending && <Loader2 className="animate-spin" />
                }
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default DuplicateWorkflowDialog