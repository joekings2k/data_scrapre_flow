"use client";
import React, { useCallback } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import CustomDialogHeader from "@/components/CustomDialogHeader";
import { Loader2, ShieldEllipsis } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  createWorkflowSchema,
  CreateWorkflowSchemaType,
} from "@/schema/workflow";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import { createWorkflow } from "@/actions/workflows/createWorkflow";
import { toast } from "sonner";
import {
  createCredentialSchema,
  CreateCredentialSchemaType,
} from "@/schema/credential";
import { createCredential } from "@/actions/credentials/createCredential";

const CreateCredentialsDialog = ({ triggerText }: { triggerText?: string }) => {
  const [open, setOpen] = React.useState(false);
  const form = useForm<CreateCredentialSchemaType>({
    resolver: zodResolver(createCredentialSchema),
  });
  const { mutate, isPending } = useMutation({
    mutationFn: createCredential,
    onSuccess: () => {
      toast.success("Workflow created successfully", {
        id: "create-credential",
      });
      form.reset();
      setOpen(false);
    },
    onError: (error) => {
      toast.error(error.message, { id: "create-credential" });
    },
  });
  const onSubmit = useCallback(
    (values: CreateCredentialSchemaType) => {
      toast.loading("Creating credential", { id: "create-credential" });
      mutate(values);
    },
    [mutate]
  );
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button> {triggerText ?? "Create"}</Button>
      </DialogTrigger>
      <DialogContent className="px-0">
        <CustomDialogHeader
          title="Create credential"
          subTitle="Start building your credential"
          icon={ShieldEllipsis}
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
                      Enter a unique and descriptive name for the credential{" "}
                      <br />
                      This name will be used to identify the credential
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Value</FormLabel>
                    <p className="text-xs text-primary">(required)</p>
                    <FormControl>
                      <Textarea
                        placeholder="Value"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter the value associated with this credential
                      <br />
                      This value will be securely encrypted and stored
                    </FormDescription>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type={"submit"} className="w-full" disabled={isPending}>
                {!isPending && "Proceed"}
                {isPending && <Loader2 className="animate-spin" />}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCredentialsDialog;
