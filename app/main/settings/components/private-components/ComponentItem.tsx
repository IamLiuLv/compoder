import React from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Code, Eye, Copy, CheckCircle2, X } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Rule } from "../types"

interface ComponentItemProps {
  componentName: string
  libraryName: string
  rule: Rule
  isCopied: boolean
  isImported: boolean
  onEditDocs: (componentName: string) => void
  onCopyDocs: (componentName: string) => void
  onDeleteDocs: (componentName: string, libraryName: string) => void
  onPreviewDocs: (componentName: string) => void
  componentRef: (element: HTMLDivElement | null) => void
}

export function ComponentItem({
  componentName,
  libraryName,
  rule,
  isCopied,
  isImported,
  onEditDocs,
  onCopyDocs,
  onDeleteDocs,
  onPreviewDocs,
  componentRef
}: ComponentItemProps) {
  const hasDocumentation = rule.docs && rule.docs[libraryName]?.[componentName];

  return (
    <div
      ref={componentRef}
      className={`border rounded-md p-3 transition-all duration-500
        ${isCopied ? 'border-green-500 bg-green-50' : ''}
        ${isImported ? 'border-blue-500 bg-blue-50 animate-pulse' : ''}`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="font-medium flex items-center">
          {componentName}
          <Badge variant="outline" className="ml-2 text-xs">{libraryName}</Badge>
          {isCopied && <CheckCircle2 className="h-4 w-4 text-green-500 ml-2" />}
          {isImported && (
            <Badge variant="outline" className="ml-2 bg-blue-100 text-blue-800 border-blue-200">
              新导入
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="h-7 w-7 p-0"
                  onClick={() => onEditDocs(componentName)}
                >
                  <FileText className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{hasDocumentation ? '编辑文档' : '添加文档'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {hasDocumentation && (
            <>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 p-0 text-blue-500"
                      onClick={() => onCopyDocs(componentName)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>复制文档到下一个未配置的组件</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 p-0 text-yellow-500"
                      onClick={() => onDeleteDocs(componentName, libraryName)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>删除文档</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 p-0 text-blue-500"
                      onClick={() => onPreviewDocs(componentName)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>预览文档</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </>
          )}
        </div>
      </div>

      {hasDocumentation && (
        <div className="text-xs text-muted-foreground flex items-center mt-1">
          <div className="mr-2 flex items-center">
            <Code className="h-3 w-3 mr-1" />
            <span>API文档</span>
          </div>
          <div className="flex items-center ml-2 cursor-pointer text-blue-500" onClick={() => onPreviewDocs(componentName)}>
            <Eye className="h-3 w-3 mr-1" />
            <span>预览文档</span>
          </div>
        </div>
      )}
    </div>
  )
}