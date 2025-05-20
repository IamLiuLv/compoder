import React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import GuidesConfig from "./GuidesConfig"
import RulesConfig from "./RulesConfig"
import { Codegen, CodegenListItem } from "./types"
import { Loader2 } from "lucide-react"

interface CodegenEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editing: CodegenListItem | null
  formData: Partial<Codegen>
  formLoading: boolean
  formError: string | null
  onFormChange: (form: Partial<Codegen>) => void
  onSubmit: () => Promise<void>
  onRetry: () => void
}

export default function CodegenEditDialog({
  open,
  onOpenChange,
  editing,
  formData,
  formLoading,
  formError,
  onFormChange,
  onSubmit,
  onRetry
}: CodegenEditDialogProps) {
  // 选项卡状态
  const [activeTab, setActiveTab] = React.useState("basic")

  // 表单字段更新处理函数
  const handleInputChange = (field: string, value: any) => {
    onFormChange({ ...formData, [field]: value })
  }

  // 表单验证
  const isFormValid = () => {
    return !!(
      formData.title &&
      formData.description &&
      formData.model &&
      formData.codeRendererUrl
    )
  }

  // 关闭时重置选项卡
  React.useEffect(() => {
    if (!open) {
      // 延迟重置，确保动画结束后再重置
      const timer = setTimeout(() => {
        setActiveTab("basic")
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] overflow-hidden flex flex-col p-0">
        {/* 固定头部 */}
        <DialogHeader className="flex flex-row items-center justify-between pb-2 border-b p-6">
          <div>
            <DialogTitle className="text-xl">
              {editing ? "编辑" : "新增"} Codegen
            </DialogTitle>
            <DialogDescription className="mt-1.5">
              {editing ? "修改现有的Codegen配置" : "添加新的Codegen配置并设置相关参数"}
            </DialogDescription>
          </div>
        </DialogHeader>

        {/* 可滚动的内容区域 */}
        <div className="flex-1 overflow-y-auto p-6">
          {formLoading ? (
            <div className="py-12 text-center flex flex-col items-center justify-center space-y-4">
              <Loader2 className="h-10 w-10 text-primary animate-spin" />
              <p className="text-muted-foreground">正在加载详情...</p>
            </div>
          ) : formError ? (
            <div className="py-12 text-center flex flex-col items-center justify-center">
              <div className="bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 rounded-lg p-4 mb-4 max-w-md">
                <p className="font-medium">{formError}</p>
                <p className="text-sm mt-1 text-red-500 dark:text-red-300">请重试或检查网络连接</p>
              </div>
              <Button
                onClick={onRetry}
                variant="outline"
                className="mt-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                  <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                  <path d="M16 21h5v-5" />
                </svg>
                重新获取详情
              </Button>
            </div>
          ) : (
            <div className="pt-2">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="basic" className="h-10">基本信息</TabsTrigger>
                  <TabsTrigger value="guides" className="h-10">指南配置</TabsTrigger>
                  <TabsTrigger value="rules" className="h-10">规则配置</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4 pt-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium mb-1.5">标题 <span className="text-red-500">*</span></p>
                      <Input
                        placeholder="输入标题"
                        value={formData.title || ""}
                        onChange={e => handleInputChange("title", e.target.value)}
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1.5">框架类型 <span className="text-red-500">*</span></p>
                      <Select
                        value={formData.fullStack || "React"}
                        onValueChange={value => handleInputChange("fullStack", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="选择框架" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="React">React</SelectItem>
                          <SelectItem value="Vue">Vue</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-1.5">描述 <span className="text-red-500">*</span></p>
                    <Textarea
                      placeholder="描述该Codegen的用途和功能"
                      value={formData.description || ""}
                      onChange={e => handleInputChange("description", e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium mb-1.5">模型 <span className="text-red-500">*</span></p>
                      <Input
                        placeholder="例如: gpt-4-turbo"
                        value={formData.model || ""}
                        onChange={e => handleInputChange("model", e.target.value)}
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1.5">渲染器URL <span className="text-red-500">*</span></p>
                      <Input
                        placeholder="渲染器URL地址"
                        value={formData.codeRendererUrl || ""}
                        onChange={e => handleInputChange("codeRendererUrl", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground mt-2">
                    <span className="text-red-500">*</span> 表示必填字段
                  </div>
                </TabsContent>

                <TabsContent value="guides" className="pt-2">
                  <p className="text-sm text-muted-foreground mb-4">
                    配置指南将会辅助AI更好地理解开发需求和规范
                  </p>
                  <GuidesConfig
                    guides={formData.guides || []}
                    onChange={(guides) => handleInputChange("guides", guides)}
                  />
                </TabsContent>

                <TabsContent value="rules" className="pt-2">
                  <p className="text-sm text-muted-foreground mb-4">
                    配置规则将决定AI在生成代码时应遵循的约束和标准
                  </p>
                  <RulesConfig
                    rules={formData.rules || []}
                    onChange={(rules) => handleInputChange("rules", rules)}
                  />
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>

        {/* 固定底部 */}
        <DialogFooter className="flex-shrink-0 px-6 py-4 border-t bg-background flex items-center justify-between">
          <div className="flex gap-2">
            {activeTab !== "basic" && (
              <Button
                variant="outline"
                onClick={() => setActiveTab(activeTab === "rules" ? "guides" : "basic")}
              >
                上一步
              </Button>
            )}
            {activeTab !== "rules" && (
              <Button
                variant="outline"
                onClick={() => setActiveTab(activeTab === "basic" ? "guides" : "rules")}
              >
                下一步
              </Button>
            )}
          </div>
          <Button
            onClick={onSubmit}
            disabled={!isFormValid()}
            className="ml-auto"
          >
            {editing ? "保存更改" : "创建"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}