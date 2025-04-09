import { Loader2 } from 'lucide-react'
import React from 'react'

function loading() {
  return (
    <div className='flex justify-center items-center h-screen w-full'>
      <Loader2 className='animate-spin stroke-primary' size={30} />
    </div>
  )
}

export default loading