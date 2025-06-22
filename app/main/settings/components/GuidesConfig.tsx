import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle, Trash2, ArrowUp, ArrowDown, ExternalLink } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Textarea } from "@/components/ui/textarea"

interface GuidesConfigProps {
  guides: string[]
  onChange: (guides: string[]) => void
}

export default function GuidesConfig({ guides = [], onChange }: GuidesConfigProps) {
  const [inputValue, setInputValue] = useState("")
  const [error, setError] = useState<string | null>(null)

  // 添加指南
  const addGuide = () => {
    if (!inputValue.trim()) {
      setError("指南内容不能为空")
      return
    }

    // 检查重复
    if (guides.includes(inputValue.trim())) {
      setError("该指南已存在")
      return
    }

    onChange([...guides, inputValue.trim()])
    setInputValue("")
    setError(null)
  }

  // 删除指南
  const removeGuide = (index: number) => {
    onChange(guides.filter((_, i) => i !== index))
  }

  // 上移指南
  const moveUp = (index: number) => {
    if (index <= 0) return
    const newGuides = [...guides]
    const temp = newGuides[index]
    newGuides[index] = newGuides[index - 1]
    newGuides[index - 1] = temp
    onChange(newGuides)
  }

  // 下移指南
  const moveDown = (index: number) => {
    if (index >= guides.length - 1) return
    const newGuides = [...guides]
    const temp = newGuides[index]
    newGuides[index] = newGuides[index + 1]
    newGuides[index + 1] = temp
    onChange(newGuides)
  }

  // 判断链接类型并获取格式化显示
  const getGuideDisplay = (guide: string) => {
    const isUrl = guide.startsWith('http://') || guide.startsWith('https://')

    if (isUrl) {
      // 截取域名部分显示
      try {
        const url = new URL(guide)
        return (
          <div className="flex items-center gap-1">
            <ExternalLink className="h-3 w-3" />
            <span className="truncate max-w-[200px]" title={guide}>
              {url.hostname}{url.pathname === '/' ? '' : url.pathname}
            </span>
          </div>
        )
      } catch {
        return guide
      }
    }

    return guide
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col space-y-2">
        <div className="flex flex-col gap-2">
          <Textarea
            placeholder="添加指南文本"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value)
              if (error) setError(null)
            }}
            onKeyDown={(e) => {
              // Ctrl+Enter 或 Cmd+Enter 提交
              if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                e.preventDefault()
                addGuide()
              }
            }}
            className={`min-h-[80px] ${error ? "border-red-500" : ""}`}
          />
          <div className="flex justify-between items-center">
            {error && (
              <p className="text-red-500 text-xs">{error}</p>
            )}
            <div className={`${error ? 'flex-1 text-right' : 'w-full'}`}>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={addGuide}
                className="ml-auto"
              >
                <PlusCircle className="h-4 w-4 mr-1" />
                添加指南
              </Button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            提示：可以输入URL链接或指南文本，按 Ctrl+Enter 快速添加
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {guides.map((guide, i) => (
          <div
            key={i}
            className="bg-primary/5 border border-primary/20 text-primary rounded-md flex items-center justify-between overflow-hidden group"
          >
            <div className="flex-1 px-3 py-2 truncate">
              {getGuideDisplay(guide)}
            </div>
            <div className="flex items-center pr-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 p-0 opacity-70 hover:opacity-100"
                      onClick={() => moveUp(i)}
                      disabled={i === 0}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>上移</p>
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
                      className="h-7 w-7 p-0 opacity-70 hover:opacity-100"
                      onClick={() => moveDown(i)}
                      disabled={i === guides.length - 1}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>下移</p>
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
                      className="h-7 w-7 p-0 text-red-500 opacity-70 hover:opacity-100"
                      onClick={() => removeGuide(i)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>删除</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        ))}

        {guides.length === 0 && (
          <div className="text-center py-6 text-muted-foreground border border-dashed rounded-md">
            暂无指南配置
          </div>
        )}
      </div>
    </div>
  )
}