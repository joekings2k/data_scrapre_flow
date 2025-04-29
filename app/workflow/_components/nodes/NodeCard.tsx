'use client'
import useFlowValidation from '@/hooks/useFlowValidation';
import { cn } from '@/lib/utils'
import { useReactFlow } from '@xyflow/react';
import React from 'react'

function NodeCard({
  children,
  nodeId,
  isSelected,
}: {
  nodeId: string;
  isSelected: boolean;
  children: React.ReactNode;
}) {
 const {getNode ,setCenter}= useReactFlow()
 const {invalidInputs}= useFlowValidation()
 const hasInvalidInputs  = invalidInputs.some(input=>input.nodeId === nodeId)
  return (
    <div
      onDoubleClick={()=>{
        const node = getNode(nodeId);
        if(!node )return ;
        const {position,measured} = node;
        if(!position || !measured)return;
        const {width,height} = measured
        const x = position.x + width!/2
        const y = position.y + height!/2
        setCenter(x,y,{
          zoom:1,
          duration:700
        })
        
      }}
      className={cn(
        "border-2 border-separate rounded-md cursor-pointer bg-background w-[420px] text-xs gap-1 flex flex-col",
        isSelected && "border-primary",
        hasInvalidInputs && "border-destructive border-2"
      )}
    >
      {children}
    </div>
  );
}

export default NodeCard