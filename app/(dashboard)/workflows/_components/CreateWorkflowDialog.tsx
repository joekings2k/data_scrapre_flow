'use client';
import React, { useCallback } from 'react'
import { Dialog,DialogContent,DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import CustomDialogHeader from '@/components/CustomDialogHeader';
import { Layers2Icon, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { createWorkflowSchema, CreateWorkflowSchemaType } from '@/schema/workflow';
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

const CreateWorkflowDialog = ({triggerText}:{triggerText?:string}) => {
  const [open, setOpen] = React.useState(false)
  const form = useForm<CreateWorkflowSchemaType>(
    { resolver: zodResolver(createWorkflowSchema) }
  )
  const{mutate,isPending}= useMutation(
    {
      mutationFn:createWorkflow,
      onSuccess:()=>{
        toast.success("Workflow created successfully",{id:"create-workflow"})
      },
      onError:(error)=>{
        toast.error(error.message,{id:"create-workflow"})
      }
    }
  )
  const onSubmit = useCallback((values:CreateWorkflowSchemaType)=>{
    toast.loading("Creating workflow",{id:"create-workflow"})
    mutate(values)
  },[mutate])
  return (
    <Dialog open={open} onOpenChange={(open)=>{
      form.reset()
      setOpen(open)
    }}>
      <DialogTrigger asChild>
        <Button> {triggerText ?? "Create Workflow"}</Button>
      </DialogTrigger>
      <DialogContent className="px-0">
        <CustomDialogHeader
          title="Create Workflow"
          subTitle="Start building your workflow"
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

export default CreateWorkflowDialog