import { getWorkflowsForUser } from "@/actions/workflows/getWorkflowsForUser";
import { Skeleton } from "@/components/ui/skeleton";
import { waitFor } from "@/lib/helper/waitFor";
import React, { Suspense } from "react";
import {Alert,AlertDescription,AlertTitle} from "@/components/ui/alert"
import { AlertCircle } from "lucide-react";
export default function page() {
  return (
    <div className="flex-1 flex flex-col h-full  ">
      <div className="flex justify-between">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold">Workflows</h1>
          <p className="text-muted-foreground">Manage your workflows</p>
        </div>
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
    console.log(workflows)
    return <div>Workflow</div>;
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
