"use client";
import TooltipWrapper from "@/components/TooltipWrapper";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import SaveBtn from "./SaveBtn";
import ExecuteBtn from "./ExecuteBtn";
import NavigationTabs from "./NavigationTabs";
import PublishBtn from "./PublishBtn";
import UnPublishBtn from "@/app/workflow/_components/topbar/Unpublish";

function TopBar({
  title,
  subTitle,
  workflowId,
  hideButtons = false,
  isPublished = false,
}: {
  title: string;
  subTitle?: string;
  workflowId: string;
  hideButtons?: boolean;
  isPublished?:boolean;
}) {
  const router = useRouter();
  return (
    <header className="flex p-2 border-b-2 border-separate justify-between w-full h-[60px]  sticky top-0 bg-background z-10">
      <div className="flex flex-1 gap-1">
        <TooltipWrapper content="Back">
          <Button variant={"ghost"} size={"icon"} onClick={() => router.back()}>
            <ChevronLeftIcon size={20} />
          </Button>
        </TooltipWrapper>
        <div>
          <p className=" font-bold text-ellipsis truncate">{title}</p>
          {subTitle && (
            <p className="text-ellipsis truncate text-xs text-muted-foreground">
              {subTitle}
            </p>
          )}
        </div>
      </div>
      <NavigationTabs workflowId={workflowId} />
      <div className="flex gap-1 flex-1 justify-end">
        {!hideButtons && (
          <>
            <ExecuteBtn workflowId={workflowId} />
            {isPublished && <UnPublishBtn workflowId={workflowId} />}

            {!isPublished && (
              <>
                <SaveBtn workflowId={workflowId} />
                <PublishBtn workflowId={workflowId} />
              </>
            )}
          </>
        )}
      </div>
    </header>
  );
}

export default TopBar;
