import { Button } from '@/components/ui/button'
import { BaseEdge, EdgeLabelRenderer, EdgeProps, getSmoothStepPath, MarkerType, useReactFlow } from '@xyflow/react'
import React from 'react'

export const DeletableEdge = (props:EdgeProps) => {
  const [edgePath,labelX,labelY] = getSmoothStepPath(props)
  const {setEdges} =useReactFlow()
  const markerEnd = {
    type:MarkerType.ArrowClosed,
    color:"#888",
    width:20,
    height:20,
  }
  return (
    <>
    <BaseEdge path={edgePath} markerEnd={props.markerEnd} markerStart={props.markerStart} style={props.style} />
     <EdgeLabelRenderer>
      <div  style={{
        position:"absolute",
        transform:`translate(-50%,-50%) translate(${labelX}px,${labelY}px) `,
        pointerEvents:"all"
      }} >
        
        <Button variant={"outline"} size={"icon"} className='cursor-pointer w-5 h-5 border rounded-full text-xs leading-none hover:shadow-lg'onClick={()=>setEdges((eds)=>eds.filter((edge)=>edge.id !== props.id))}> x</Button>
      </div>
    </EdgeLabelRenderer> 
    </>
  )
}
