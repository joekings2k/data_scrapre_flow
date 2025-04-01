'use client'
import { usePathname } from 'next/navigation'
import React from 'react'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from './ui/breadcrumb'
import { MobileSideBar } from './sidebar'

function Breadcrumbheader() {
  const pathName = usePathname()
  const paths  = pathName === '/' ? [""] :pathName?.split('/')
  console.log(paths)
  return (
    <div className='flex items-center  '>
      <MobileSideBar />
      <Breadcrumb>
      <BreadcrumbList>
      {
        paths.map((path, index) => (
          <React.Fragment key={index}>
            <BreadcrumbItem>
            <BreadcrumbLink className='capitalize' href={`/${path}`}>
              {path === "" ? "Home" : path}
            </BreadcrumbLink>
            </BreadcrumbItem>
          </React.Fragment>
      ))}
      </BreadcrumbList>
      </Breadcrumb>
    </div>
  )
}

export default Breadcrumbheader