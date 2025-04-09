import { getWorkflowsForUser } from "@/actions/workflows/getWorkflowsForUser";
import { Skeleton } from "@/components/ui/skeleton";
import { waitFor } from "@/lib/helper/waitFor";
import React, { Suspense } from "react";
import {Alert,AlertDescription,AlertTitle} from "@/components/ui/alert"
import { AlertCircle, InboxIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import CreateWorkflowDialog from "./_components/CreateWorkflowDialog";
import WorkflowCard from "./_components/WorkflowCard";
export default function page() {
  return (
    <div className="flex-1 flex flex-col h-full  ">
      <div className="flex justify-between">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold">Workflows</h1>
          <p className="text-muted-foreground">Manage your workflows</p>
        </div>
        <CreateWorkflowDialog />
      </div>
      <div className="h-full py-6">
        <Suspense fallback={<UserWorkflowSkeleton />}>
          <UserWorkflows />
        </Suspense>
      </div>
    </div>
  );
}

const UserWorkflowSkeleton = () => {
  return (
    <div className="space-y-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-32 w-full" />
      ))}
    </div>
  );
};

const UserWorkflows =  async() => {
  
  try {
    const workflows = await getWorkflowsForUser();
    if(workflows.length === 0){
      return <div className="flex flex-col gap-4 h-full items-center justify-center">
        <div className="rounded-full bg-accent w-20 h-20 flex items-center justify-center">
          <InboxIcon size={40} className="stroke-primary"/>
        </div>
        <div className="flex flex-col gap-1 text-center">
          <p className=" font-bold">You have no workflows yet</p>
          <p className="text-muted-foreground text-sm">Click the button below to create your first workflow</p>
        </div>
        <CreateWorkflowDialog triggerText="Create your first workflow" />
      </div>
    }
   
    return <div className="gird grid-cols-1 gap-4 ">
      {
        workflows.map(workflow=>(
          <WorkflowCard workflow={workflow} />
        ))
      }
    </div>
  } catch (error) {
    return (
      <Alert variant={"destructive"}>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Something went wrong</AlertTitle>
        <AlertDescription>
          There was an error fetching your workflows
        </AlertDescription>
      </Alert>
    );
  }
};
