import React from 'react'
import { TaskParam, TaskType } from './task';
import { Node } from '@xyflow/react';

export interface AppNodeData  {
  [key:string]:any;
  type:TaskType
  inputs:Record<string,string>
}
export interface  AppNode extends Node{
  data:AppNodeData
}
export interface ParamProps {
  param :TaskParam
  value:string
  updateNodeParamValue:(value:string)=>void
  disabled?:boolean
}

export type AppNodeMissingInputs = {
  nodeId:string,
  inputs:TaskParam[] // remember to come hear was an array of string
}