"use client"

import React from "react"
import { Loading } from "@/components/biz/Loading"
import useRoutes from "@/hooks/use-routes"
import { useSession, signOut } from "next-auth/react"
import { redirect } from "next/navigation"
import { useEffect } from "react"
import { AppSidebarLayout } from "@/components/biz/AppSidebarLayout"
import {
  ProviderModelModalProvider,
} from "@/app/commons/ProviderModelModal"
import { type NavMainItem } from "@/components/biz/AppSidebarLayout/interface"

// create a internal component to use context
function MainLayoutContent({
  children,
  user,
}: {
  children: React.ReactNode
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const routes = useRoutes()

  return (
    <AppSidebarLayout
      navMain={routes as NavMainItem[]}
      user={user}
      onLogout={signOut}
    >
      {children}
    </AppSidebarLayout>
  )
}

// main layout
export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { status, data } = useSession()

  const user = {
    name: data?.user?.name || "",
    email: data?.user?.email || "",
    avatar: data?.user?.image || "",
  }

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/login")
    }
  }, [status])

  // Show loading state while checking authentication status
  if (status === "loading") {
    return <Loading fullscreen />
  }

  return (
    <ProviderModelModalProvider>
      <MainLayoutContent user={user}>{children}</MainLayoutContent>
    </ProviderModelModalProvider>
  )
}
