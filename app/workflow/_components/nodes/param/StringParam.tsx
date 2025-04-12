"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ParamProps } from "@/types/appNode";
import { TaskParam } from "@/types/task";
import React, { useEffect, useId } from "react";

function StringParam({ param, value, disabled,updateNodeParamValue }: ParamProps) {
  const [internalvalue, setInternalValue] = React.useState(value);
  useEffect(() => {
    setInternalValue(value);
  }, [value]);
  let Component: any = Input;

  if (param.variant === "textarea") {
    Component = Textarea;
  }

  const id = useId();
  return (
    <div className="space-y-1 p-1 w-full ">
      <Label htmlFor={id} className="text-xs flex ">
        {param.name}
        {param.required && <p className="text-red-400">*</p>}
      </Label>
      <Component
        id={id}
        value={internalvalue}
        className="text-xs"
        onChange={(e: any) => setInternalValue(e.target.value)}
        placeholder="Enter value here"
        onBlur={(e: any) => updateNodeParamValue(e.target.value)}
        disabled={disabled}
      />
      {param.helperText && (
        <p className="text-xs text-muted-foreground px-2">{param.helperText}</p>
      )}
    </div>
  );
}

export default StringParam;
