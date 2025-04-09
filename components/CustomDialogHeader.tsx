"use client"
import React from 'react'
import { DialogHeader, DialogTitle } from './ui/dialog'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Separator } from './ui/separator'
interface Props {
  title?:string
  subTitle?:string
  icon?:LucideIcon
  iconClassname?:string
  subTitleClassname?:string
  titleClassname?:string
}
const CustomDialogHeader = (props:Props) => {
  const {title,subTitle,iconClassname,titleClassname,subTitleClassname} = props
  const Icon =props.icon
  return (
    <DialogHeader>
      <DialogTitle asChild>
        <div className="flex gap-2 flex-col items-center mb-2">
          {Icon && (
            <Icon size={30} className={cn("stroke-primary", iconClassname)} />
          )}
          {
            title && (
              <p className={cn("text-xl text-primary ",titleClassname)}>
                {title}
              </p>
            )
          }
          {
            subTitle && (
              <p className={cn("text-sm text-muted-foreground ",subTitleClassname)}>
                {subTitle}
              </p>
            )
          }
        </div>
      </DialogTitle>
      <Separator />
    </DialogHeader>
  );
}

export default CustomDialogHeader