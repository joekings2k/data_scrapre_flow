"use client";
import React, { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { updateWorkflowCron } from "@/actions/workflows/updateWorkflowCron";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { CalendarIcon, ClockIcon, TriangleAlertIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import CustomDialogHeader from "@/components/CustomDialogHeader";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import cronstrue from "cronstrue";
import parser from "cron-parser"
import { removeWorkflowSchedule } from "@/actions/workflows/removeWorkflowSchedule";
import { Separator } from "@/components/ui/separator";
export default function SchedulerDialog(props:{workflowId:string,cron:string | null}) {
  const mutation = useMutation({
    mutationFn: updateWorkflowCron,
    onSuccess: () => {
      toast.success("Schedule  updated successfully", { id: "update-cron" });
    },
    onError: (error) => {
      toast.error(error.message, { id: "update-cron" });
    },
  });
  const removeSchedulerMutation = useMutation({
    mutationFn: removeWorkflowSchedule,
    onSuccess: () => {
      toast.success("Schedule  updated successfully", { id: "update-cron" });
    },
    onError: (error) => {
      toast.error(error.message, { id: "update-cron" });
    },
  });
  const [cron, setCron] = useState<string>(props.cron || "");
  const [validCron, setValidCron] = useState(false);
  const [readbleCron, setReadableCron] = useState<string>("");

  useEffect(() => {
    try {
      parser.parseExpression(cron)
      const humanCronStr = cronstrue.toString(cron);
      setValidCron(true);
      setReadableCron(humanCronStr);
    } catch (error) {
      setValidCron(false);
    }
  }, [cron]);
  const workflowHasValidcron = props.cron && props.cron.length >0
  const readbleSavedCron = workflowHasValidcron ? cronstrue.toString(props.cron!) : ""
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={"link"}
          size={"sm"}
          className={cn("text-sm p-0 h-auto text-orange-500",workflowHasValidcron && "text-primary")}

        >
          {workflowHasValidcron && (
            <div className="flex items-center gap-2">
              <ClockIcon />
              {readbleSavedCron}
            </div>
          )}
          {!workflowHasValidcron && (
            <div className="flex items-center gap-1">
              <TriangleAlertIcon className="h-3 w-3" /> Set schedule
            </div>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="px-0">
        <CustomDialogHeader
          title="Schedule workflow execution"
          icon={CalendarIcon}
        />
        <div className="p-6 space-y-4  ">
          <p>
            Specify a cron expression to schedule periodic workflow execution
            All times in UTC
          </p>
          <Input
            placeholder="E.g. * * * * *"
            value={cron}
            onChange={(e) => setCron(e.target.value)}
          />
          <div
            className={cn(
              "bg-accent rounded-md p-4 border text-sm border-destructive text-destructive",
              validCron && "border-primary text-primary"
            )}
          >
            {validCron ? readbleCron : "Not a valid cron expression"}
          </div>
          {
            workflowHasValidcron && <DialogClose asChild>
              <div className="">
                <Button className="w-full text-destructive border-destructive hover:text-destructive" variant={'outline'} disabled={mutation.isPending || removeSchedulerMutation.isPending} onClick={() => {
                  toast.loading("Removing schedule ... ");
                  removeSchedulerMutation.mutate(props.workflowId);
                }}>
                  
                  Remove current schedule 
                </Button>
                <Separator className="my-4" />
              </div>
            </DialogClose>
          }
        </div>
        <DialogFooter className="px-6 gap-2">
          <DialogClose asChild>
            <Button variant={"secondary"} className="w-full">
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              variant={"default"}
              disabled={mutation.isPending || !validCron}
              className="w-full"
              onClick={() => {
                toast.loading("saving ... ");
                mutation.mutate({ id: props.workflowId, cron });
              }}
            >
              save
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
