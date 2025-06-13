"use client";
import { downloadInvoice } from "@/actions/billing/downloadInvoice";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import React from "react";
import { toast } from "sonner";

export default function InvoiceBtn({ id }: { id: string }) {
  const mutation = useMutation({
    mutationFn: downloadInvoice,
    onSuccess: (data) => {
      window.location.href = data as string ;
    },
    onError: (error) => {
      toast.error("something went wrong", { id: "download-invoice" });
     
    },
  });
  return (
    <Button
      variant={"link"}
      size={"sm"}
      className="text-sm gap-2 text-muted-foreground px-1"
      disabled={mutation.isPending}
      onClick={() => {
        mutation.mutate(id);
      }}
    >
      Invoice
      {mutation.isPending && <Loader2Icon className="w-4 h-4 animate-spin" /> }
    </Button>
  );
}
