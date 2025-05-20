import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { PlusCircle, Trash2, AlertCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Rule } from "./types"

interface RulesConfigProps {
  rules: Rule[]
  onChange: (rules: Rule[]) => void
}

export default function RulesConfig({ rules = [], onChange }: RulesConfigProps) {
  const [error, setError] = useState<string | null>(null)
  const [componentInput, setComponentInput] = useState("")

  // 添加新规则
  const addRule = () => {
    onChange([
      ...rules,
      {
        type: "public-components",
        description: "",
        dataSet: []
      }
    ])
  }

  // 更新规则
  const updateRule = (index: number, field: string, value: any) => {
    const updatedRules = [...rules]
    if (!updatedRules[index]) {
      updatedRules[index] = { type: "public-components", description: "" }
    }
    updatedRules[index] = {
      ...updatedRules[index],
      [field]: value
    }
    onChange(updatedRules)
  }

  // 删除规则
  const deleteRule = (index: number) => {
    onChange(rules.filter((_, i) => i !== index))
  }

  // 添加组件到 dataSet
  const addComponentToDataSet = (index: number, component: string) => {
    if (!component.trim()) {
      setError("组件名不能为空")
      return
    }

    const rule = rules[index]
    if (!rule) return

    const dataSet = rule.dataSet || []
    if (dataSet.includes(component.trim())) {
      setError("该组件已存在")
      return
    }

    updateRule(index, "dataSet", [...dataSet, component.trim()])
    setComponentInput("")
    setError(null)
  }

  // 从 dataSet 删除组件
  const removeComponentFromDataSet = (ruleIndex: number, componentIndex: number) => {
    const rule = rules[ruleIndex]
    if (!rule || !rule.dataSet) return

    const newDataSet = rule.dataSet.filter((_, i) => i !== componentIndex)
    updateRule(ruleIndex, "dataSet", newDataSet)
  }

  // 动态渲染规则表单字段
  const renderRuleFields = (rule: Rule, index: number) => {
    if (!rule) return null

    return (
      <div className="space-y-3">
        <Select
          value={rule.type}
          onValueChange={(value: any) => updateRule(index, "type", value)}
          defaultValue="public-components"
        >
          <SelectTrigger>
            <SelectValue placeholder="选择规则类型" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="public-components">公共组件</SelectItem>
            <SelectItem value="styles">样式</SelectItem>
            <SelectItem value="private-components">私有组件</SelectItem>
            <SelectItem value="file-structure">文件结构</SelectItem>
            <SelectItem value="attention-rules">注意事项</SelectItem>
          </SelectContent>
        </Select>

        <Input
          placeholder="描述"
          value={rule.description || ""}
          onChange={e => updateRule(index, "description", e.target.value)}
        />

        {(rule.type === "styles" || rule.type === "file-structure" || rule.type === "attention-rules") ? (
          <Textarea
            placeholder="提示词内容"
            value={rule.prompt || ""}
            onChange={e => updateRule(index, "prompt", e.target.value)}
            className="min-h-[100px]"
          />
        ) : rule.type === "public-components" ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Input
                placeholder="添加组件库名称，例如：antd / element-plus"
                value={componentInput}
                onChange={e => {
                  setComponentInput(e.target.value)
                  if (error) setError(null)
                }}
                onKeyDown={e => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addComponentToDataSet(index, componentInput)
                  }
                }}
                className={error ? "border-red-500" : ""}
              />
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => addComponentToDataSet(index, componentInput)}
              >
                <PlusCircle className="h-4 w-4" />
              </Button>
            </div>

            {error && (
              <p className="text-red-500 text-xs">{error}</p>
            )}

            <div className="flex flex-wrap gap-1 mt-1">
              {(rule.dataSet || []).length > 0 ? (
                (rule.dataSet || []).map((item, i) => (
                  <div key={i} className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-md flex items-center gap-1">
                    {item}
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="h-4 w-4 p-0"
                      onClick={() => removeComponentFromDataSet(index, i)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground">
                  未添加任何组件
                </div>
              )}
            </div>
          </div>
        ) : rule.type === "private-components" ? (
          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="p-3 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-amber-700 mt-0.5" />
              <p className="text-xs text-amber-700">
                私有组件配置需要额外的配置，目前暂不支持在此界面编辑。请使用 API 进行配置。
              </p>
            </CardContent>
          </Card>
        ) : null}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {rules.map((rule, index) => (
          <Card key={index}>
            <CardHeader className="py-2 px-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm">规则 {index + 1}</CardTitle>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-red-500 hover:bg-red-50"
                        onClick={() => deleteRule(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>删除规则</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </CardHeader>
            <CardContent className="py-2 px-4">
              {renderRuleFields(rule, index)}
            </CardContent>
          </Card>
        ))}
      </div>

      {rules.length === 0 && (
        <div className="text-center py-6 text-muted-foreground border border-dashed rounded-md">
          暂无规则配置
        </div>
      )}

      <div className="mt-3 flex justify-center">
        <Button type="button" onClick={addRule} size="sm" variant="outline">
          <PlusCircle className="h-4 w-4 mr-1" />
          添加规则
        </Button>
      </div>
    </div>
  )
}