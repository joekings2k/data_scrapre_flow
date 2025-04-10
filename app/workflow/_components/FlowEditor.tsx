"use client";
import { Workflow } from "@prisma/client";
import {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlow,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "@xyflow/react";
import React, { useCallback, useEffect } from "react";
import "@xyflow/react/dist/style.css";
import { CreateFlowNode } from "@/lib/workflow/createFlowNode";
import { TaskType } from "@/types/task";
import NodeComponent from "./nodes/NodeComponents";
import { AppNode } from "@/types/appNode";


const nodeTypes = {
  FlowScrapeNode:NodeComponent,
}
const snapGrid :[number,number] = [50,50]
const fitViewOptions = {
  padding: 1,
}
function FlowEditor({ workflow }: { workflow: Workflow }) {
  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>([]);
  //  const [nodes, setNodes, onNodesChange] = useNodesState([
  //    CreateFlowNode(TaskType.LAUNCH_BROWSER),
  //  ]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const {setViewport,screenToFlowPosition} = useReactFlow()
  useEffect(()=>{
    try{
      const flowDefinition = JSON.parse(workflow.definition)
      setNodes(flowDefinition.nodes || [])
      setEdges(flowDefinition.edges || [])
      if (!flowDefinition.viewport)return;
      const {x=0,y=0,zoom=1} = flowDefinition.viewport
      setViewport({x,y,zoom})
    }catch(e){
      console.log(e)
    }
  },[workflow.definition,setEdges,setNodes,setViewport])
  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  },[])
  const onDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const taskType = event.dataTransfer.getData("application/reactflow"); 
    
    if(typeof taskType === undefined || !taskType)return;

    const position = screenToFlowPosition({x:event.clientX,y:event.clientY})

    const newNode = CreateFlowNode(taskType as TaskType,position)
    setNodes((nds) => nds.concat(newNode));
    // const position = event.nativeEvent.offsetX/2
    // const newNode = CreateFlowNode(taskType,{x:position,y:0})
    // setNodes((nds) => nds.concat(newNode));
  },[])
  return (
    <main className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        snapToGrid={true}
        snapGrid={snapGrid}
        fitViewOptions={fitViewOptions}
        onDragOver={onDragOver}
        onDrop ={onDrop}
      >
        <Controls position="top-left" fitViewOptions={fitViewOptions} />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </main>
  );
}

export default FlowEditor;
