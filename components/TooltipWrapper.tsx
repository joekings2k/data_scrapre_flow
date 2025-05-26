"use client";
import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "./ui/tooltip";

interface Props {
  content: string | null;
  children: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
}

const TooltipWrapper = (props: Props) => {
  if (!props.content) return props.children;
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>{props.children}</TooltipTrigger>
        <TooltipContent side={props.side}>{props.content}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TooltipWrapper;
