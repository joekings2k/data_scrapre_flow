import { ParamProps } from '@/types/appNode'
import { TaskParam } from '@/types/task'
import React from 'react'


const BrowserInstanceParam = ({param}:ParamProps) => {
  return (
    <p className='text-xs'  >{param.name}</p>
  )
}

export default BrowserInstanceParam