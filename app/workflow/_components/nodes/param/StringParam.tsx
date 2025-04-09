'use client';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ParamProps } from "@/types/appNode";
import { TaskParam } from "@/types/task";
import React, { useId } from "react";


function StringParam({param,value,updateNodeParamValue}:ParamProps) {
  const [internalvalue, setInternalValue] = React.useState(value);
  const id = useId();
  return (
    <div className="space-y-1 p-1 w-full ">
      <Label htmlFor={id} className="text-xs flex ">
        {param.name}
        {param.required && <p className="text-red-400">*</p>}
      </Label>
      <Input id={id} value={internalvalue} className="text-xs" onChange={(e)=> setInternalValue(e.target.value)} placeholder="Enter value here" onBlur={(e)=>updateNodeParamValue(e.target.value)}  />
      {param.helperText && (
        <p className="text-xs text-muted-foreground px-2">{param.helperText}</p>
      )}
    </div>
  );
}

export default StringParam;
