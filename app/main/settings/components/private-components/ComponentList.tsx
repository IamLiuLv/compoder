import React from "react"
import { ComponentItem } from "./ComponentItem"
import { Rule } from "../types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PlusCircle, FileText } from "lucide-react"

interface ComponentListProps {
  rule: Rule
  selectedLibrary: string
  componentInput: string
  error: string | null
  copiedDocName: string | null
  importedComponents: {name: string, library: string}[]
  setComponentInput: (value: string) => void
  addComponent: (value: string) => void
  clearError: () => void
  onShowImport: () => void
  onEditDocs: (componentName: string) => void
  onCopyDocs: (componentName: string) => void
  onDeleteDocs: (componentName: string, libraryName: string) => void
  onPreviewDocs: (componentName: string) => void
  setComponentRef: (element: HTMLDivElement | null, componentName: string) => void
}

export function ComponentList({
  rule,
  selectedLibrary,
  componentInput,
  error,
  copiedDocName,
  importedComponents,
  setComponentInput,
  addComponent,
  clearError,
  onShowImport,
  onEditDocs,
  onCopyDocs,
  onDeleteDocs,
  onPreviewDocs,
  setComponentRef
}: ComponentListProps) {
  // 获取当前选中库中的组件
  const getComponentsForSelectedLibrary = () => {
    if (!rule.docs || !rule.docs[selectedLibrary]) return []
    return Object.keys(rule.docs[selectedLibrary])
  }

  // 查找没有文档的组件
  const findComponentsWithoutDocs = (currentName: string) => {
    return getComponentsForSelectedLibrary()
      .filter(name => name !== currentName && !rule.docs?.[selectedLibrary]?.[name]);
  }

  return (
    <div className="border-t pt-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-medium">
          <span className="mr-2">组件管理</span>
          <Badge variant="outline">{selectedLibrary}</Badge>
        </div>
        <div className="space-y-2 flex-1 mx-2">
          <div className="flex items-center gap-2">
            <Input
              placeholder="添加组件名称，例如：Button、Card"
              value={componentInput}
              onChange={e => {
                setComponentInput(e.target.value)
                if (error) clearError()
              }}
              onKeyDown={e => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  addComponent(componentInput)
                }
              }}
              className={error ? "border-red-500" : ""}
            />
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => addComponent(componentInput)}
            >
              <PlusCircle className="h-4 w-4" />
            </Button>
          </div>
          {error && <p className="text-red-500 text-xs">{error}</p>}
        </div>

        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={onShowImport}
          className="whitespace-nowrap"
        >
          <FileText className="h-4 w-4 mr-1" />
          导入文档
        </Button>
      </div>

      {/* 组件列表区域 */}
      <div className="space-y-2 mt-4">
        {getComponentsForSelectedLibrary().length > 0 ? (
          getComponentsForSelectedLibrary().map((componentName, i) => (
            <ComponentItem
              key={i}
              componentName={componentName}
              libraryName={selectedLibrary}
              rule={rule}
              isCopied={copiedDocName === componentName}
              isImported={importedComponents.some(comp => comp.name === componentName)}
              onEditDocs={onEditDocs}
              onCopyDocs={(name) => {
                const componentsWithoutDocs = findComponentsWithoutDocs(name);
                if (componentsWithoutDocs.length > 0) {
                  onCopyDocs(name);
                }
              }}
              onDeleteDocs={onDeleteDocs}
              onPreviewDocs={onPreviewDocs}
              componentRef={(el) => setComponentRef(el, componentName)}
            />
          ))
        ) : (
          <div className="text-sm text-muted-foreground text-center py-4 border border-dashed rounded-md">
            该组件库未添加任何组件
          </div>
        )}
      </div>
    </div>
  )
}