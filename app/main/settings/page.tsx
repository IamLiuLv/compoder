"use client"

import { useEffect, useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ProviderModelViewer } from "@/components/biz/ProviderModelViewer"
import { AppHeader } from "@/components/biz/AppHeader/AppHeader"
import CodegenTable from "./CodegenTable"

export default function Settings() {
  const [tab, setTab] = useState("provider")
  const [providers, setProviders] = useState({})
  useEffect(() => {
    fetch("/api/config").then(res => res.json()).then(data => setProviders(data.providers || {}))
  }, [])
  return (
    <div>
      <AppHeader breadcrumbs={[{ label: "Settings" }]} />
      <Tabs value={tab} onValueChange={setTab} className="mt-4">
        <TabsList>
          <TabsTrigger value="provider">AI Provider 配置</TabsTrigger>
          <TabsTrigger value="codegen">Codegen 配置管理</TabsTrigger>
        </TabsList>
        <TabsContent value="provider">
          <div className="p-4">
            <ProviderModelViewer initialData={providers} showSensitiveInfo={false} />
          </div>
        </TabsContent>
        <TabsContent value="codegen">
          <CodegenTable />
        </TabsContent>
      </Tabs>
    </div>
  )
}
