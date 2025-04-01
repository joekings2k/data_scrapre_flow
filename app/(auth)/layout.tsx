import { SignInButton, SignUpButton, SignedIn, SignedOut } from "@clerk/nextjs";

import React from 'react'

export default function layout({children}: {children: React.ReactNode}) {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center gap-4">{children}</div>
  )
}
