import Logo from '@/components/logo'
import { ThemeModeToggle } from '@/components/ThemeModeToggle'
import React from 'react'

export default function layout({children}: {children: React.ReactNode}) {
  return (
    <div className='flex flex-col w-full h-screen'>{children}
    <footer className='flex items-center justify-between p-2'>
    <Logo fontSize={"text-xl"} iconSize={16}/>
    <ThemeModeToggle />
    </footer>
    </div>
  )
}
