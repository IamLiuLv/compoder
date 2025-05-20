import React, { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { PlusCircle, Trash2, AlertCircle, X, FileText, Code, Eye, Copy, CheckCircle2 } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Rule } from "./types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

// 定义组件库接口
interface ComponentLibrary {
  name: string;
  components: {
    name: string;
    docs?: {
      description: string;
      api: string;
    }
  }[];
}

interface PrivateComponentsConfigProps {
  rule: Rule
  index: number
  updateRule: (index: number, field: string, value: any) => void
}

export default function PrivateComponentsConfig({ rule, index, updateRule }: PrivateComponentsConfigProps) {
  // 组件库列表状态
  const [libraries, setLibraries] = useState<string[]>(() => {
    if (!rule.docs) return ["@private-basic-components"];
    return Object.keys(rule.docs).length > 0 ? Object.keys(rule.docs) : ["@private-basic-components"];
  });

  // 当前选中的组件库
  const [selectedLibrary, setSelectedLibrary] = useState<string>(libraries[0] || "@private-basic-components");

  // 组件添加相关状态
  const [componentInput, setComponentInput] = useState("")
  const [error, setError] = useState<string | null>(null)

  // 新组件库添加状态
  const [showAddLibrary, setShowAddLibrary] = useState(false)
  const [newLibraryName, setNewLibraryName] = useState("")
  const [libraryError, setLibraryError] = useState<string | null>(null)

  // 文档编辑相关状态
  const [showDocsEditor, setShowDocsEditor] = useState<{componentName: string, libraryName: string} | null>(null)
  const [componentDocs, setComponentDocs] = useState<{description: string, api: string}>({
    description: '',
    api: ''
  })

  // 文档预览状态
  const [previewDocs, setPreviewDocs] = useState<{isOpen: boolean, componentName: string, libraryName: string, docs: {description: string, api: string}} | null>(null)

  // 其他状态
  const [copiedDocName, setCopiedDocName] = useState<string | null>(null)
  const [showImportJson, setShowImportJson] = useState(false)
  const [jsonInput, setJsonInput] = useState("")
  const [jsonError, setJsonError] = useState<string | null>(null)
  const [importedComponents, setImportedComponents] = useState<{name: string, library: string}[]>([])

  // 创建一个ref对象的Map，用于存储每个组件的引用
  const componentRefs = useRef<Map<string, HTMLDivElement>>(new Map())

  // 在组件导入后，清除高亮效果
  useEffect(() => {
    if (importedComponents.length > 0) {
      const timer = setTimeout(() => {
        setImportedComponents([])
      }, 5000) // 5秒后清除高亮
      return () => clearTimeout(timer)
    }
  }, [importedComponents])

  // 获取组件文档所属的库
  const getComponentLibrary = (componentName: string): string | undefined => {
    if (!rule.docs) return undefined

    // 遍历所有库，查找组件
    for (const libraryName in rule.docs) {
      if (rule.docs[libraryName]?.[componentName]) {
        return libraryName
      }
    }

    return undefined
  }

  // 获取所有可用的组件库
  const getAvailableLibraries = (): string[] => {
    if (!rule.docs) return [selectedLibrary]
    return Object.keys(rule.docs).length > 0 ? Object.keys(rule.docs) : [selectedLibrary]
  }

  // 添加组件到 dataSet
  const addComponentToDataSet = (component: string) => {
    if (!component.trim()) {
      setError("组件名不能为空")
      return
    }

    const dataSet = rule.dataSet || []
    if (dataSet.includes(component.trim())) {
      setError("该组件已存在")
      return
    }

    // 添加到dataSet
    updateRule(index, "dataSet", [...dataSet, component.trim()])

    // 创建组件的空文档结构到选中的组件库
    if (!rule.docs) {
      updateRule(index, "docs", { [selectedLibrary]: { [component.trim()]: { description: '', api: '' } } })
    } else if (!rule.docs[selectedLibrary]) {
      const updatedDocs = { ...rule.docs, [selectedLibrary]: { [component.trim()]: { description: '', api: '' } } }
      updateRule(index, "docs", updatedDocs)
    } else {
      const updatedDocs = {
        ...rule.docs,
        [selectedLibrary]: {
          ...rule.docs[selectedLibrary],
          [component.trim()]: { description: '', api: '' }
        }
      }
      updateRule(index, "docs", updatedDocs)
    }

    // 高亮新添加的组件
    setImportedComponents([{ name: component.trim(), library: selectedLibrary }])

    setComponentInput("")
    setError(null)
  }

  // 导入JSON文档
  const importFromJson = () => {
    try {
      const data = JSON.parse(jsonInput)

      // 验证格式
      if (typeof data !== 'object' || data === null) {
        setJsonError("JSON格式不正确")
        return
      }

      // 合并docs
      const currentDocs = rule.docs || {}
      const updatedDocs = { ...currentDocs }
      const addedComponents: {name: string, library: string}[] = []

      let addedCount = 0

      // 如果数据是一个组件库的格式
      if (Object.values(data).some(value =>
        typeof value === 'object' && value &&
        ('description' in value || 'api' in value))) {

        // 单个组件库的情况
        const libraryName = selectedLibrary
        updatedDocs[libraryName] = updatedDocs[libraryName] || {}

        Object.keys(data).forEach(componentName => {
          const component = data[componentName]

          // 确保组件值是对象且有必要的字段
          if (typeof component === 'object' && component &&
              (component.description !== undefined || component.api !== undefined)) {

            updatedDocs[libraryName][componentName] = {
              description: typeof component.description === 'string' ? component.description : '',
              api: typeof component.api === 'string' ? component.api : ''
            }

            // 如果组件不在数据集中，添加它
            const dataSet = rule.dataSet || []
            if (!dataSet.includes(componentName)) {
              updateRule(index, "dataSet", [...dataSet, componentName])
            }

            addedComponents.push({name: componentName, library: libraryName})
            addedCount++
          }
        })
      } else {
        // 多个组件库的情况
        Object.keys(data).forEach(libraryName => {
          const library = data[libraryName]

          if (typeof library === 'object' && library) {
            // 确保库存在于列表中
            if (!libraries.includes(libraryName)) {
              setLibraries([...libraries, libraryName])
            }

            updatedDocs[libraryName] = updatedDocs[libraryName] || {}

            Object.keys(library).forEach(componentName => {
              const component = library[componentName]

              if (typeof component === 'object' && component &&
                  (component.description !== undefined || component.api !== undefined)) {

                updatedDocs[libraryName][componentName] = {
                  description: typeof component.description === 'string' ? component.description : '',
                  api: typeof component.api === 'string' ? component.api : ''
                }

                // 如果组件不在数据集中，添加它
                const dataSet = rule.dataSet || []
                if (!dataSet.includes(componentName)) {
                  updateRule(index, "dataSet", [...dataSet, componentName])
                }

                addedComponents.push({name: componentName, library: libraryName})
                addedCount++
              }
            })
          }
        })
      }

      if (addedCount === 0) {
        setJsonError("未发现有效的组件文档")
        return
      }

      updateRule(index, "docs", updatedDocs)

      // 设置导入的组件列表，用于高亮显示
      setImportedComponents(addedComponents)

      // 关闭导入对话框
      setShowImportJson(false)
      setJsonInput("")
      setJsonError(null)

      // 等待组件渲染完成后滚动到第一个导入的组件
      setTimeout(() => {
        if (addedComponents.length > 0) {
          const firstComponent = addedComponents[0].name
          const ref = componentRefs.current.get(firstComponent)
          if (ref) {
            ref.scrollIntoView({ behavior: 'smooth', block: 'center' })
          }
        }
      }, 300)
    } catch (e) {
      setJsonError("JSON解析错误: " + (e as Error).message)
    }
  }

  // 为私有组件添加文档
  const addDocsToPrivateComponent = (componentName: string, libraryName: string) => {
    if (!showDocsEditor) return

    // 如果docs不存在，创建一个空对象
    const docs = rule.docs || {}
    const updatedDocs = {
      ...docs,
      [libraryName]: {
        ...(docs[libraryName] || {}),
        [componentName]: componentDocs
      }
    }

    updateRule(index, "docs", updatedDocs)
    setShowDocsEditor(null)
    setComponentDocs({description: '', api: ''})
  }

  // 编辑私有组件文档
  const editPrivateComponentDocs = (componentName: string) => {
    const libraryName = getComponentLibrary(componentName) || selectedLibrary
    const compDocs = rule.docs?.[libraryName]?.[componentName] || {description: '', api: ''}

    setComponentDocs({
      description: typeof compDocs.description === 'string' ? compDocs.description : '',
      api: typeof compDocs.api === 'string' ? compDocs.api : ''
    })

    setShowDocsEditor({componentName, libraryName})
  }

  // 从 dataSet 删除组件
  const removeComponentFromDataSet = (componentIndex: number) => {
    if (!rule.dataSet) return

    const componentName = rule.dataSet[componentIndex]
    const newDataSet = rule.dataSet.filter((_, i) => i !== componentIndex)
    updateRule(index, "dataSet", newDataSet)

    // 如果组件有文档，也需要删除文档
    const libraryName = getComponentLibrary(componentName)
    if (libraryName && rule.docs && rule.docs[libraryName]?.[componentName]) {
      removePrivateComponentDocs(componentName, libraryName)
    }
  }

  // 从 docs 删除组件文档
  const removePrivateComponentDocs = (componentName: string, libraryName: string) => {
    if (!rule.docs || !rule.docs[libraryName] || !rule.docs[libraryName][componentName]) return

    const updatedDocs = { ...rule.docs }
    const updatedLibraryDocs = { ...updatedDocs[libraryName] }
    delete updatedLibraryDocs[componentName]

    // 如果该库下没有组件了，删除整个库
    if (Object.keys(updatedLibraryDocs).length === 0) {
      delete updatedDocs[libraryName]
    } else {
      updatedDocs[libraryName] = updatedLibraryDocs
    }

    updateRule(index, "docs", updatedDocs)
  }

  // 打开预览对话框
  const openPreview = (componentName: string) => {
    const libraryName = getComponentLibrary(componentName)
    if (!libraryName || !rule.docs || !rule.docs[libraryName]?.[componentName]) return

    setPreviewDocs({
      isOpen: true,
      componentName,
      libraryName,
      docs: {
        description: typeof rule.docs[libraryName][componentName].description === 'string'
          ? rule.docs[libraryName][componentName].description
          : '',
        api: typeof rule.docs[libraryName][componentName].api === 'string'
          ? rule.docs[libraryName][componentName].api
          : ''
      }
    })
  }

  // 关闭预览对话框
  const closePreview = () => {
    setPreviewDocs(null)
  }

  // 复制文档到另一个组件
  const copyDocsToComponent = (sourceComponentName: string, targetComponentName: string) => {
    const sourceLibrary = getComponentLibrary(sourceComponentName)
    if (!sourceLibrary || !rule.docs || !rule.docs[sourceLibrary]?.[sourceComponentName] || sourceComponentName === targetComponentName) return

    const updatedDocs = { ...rule.docs }

    // 目标组件使用与源组件相同的库
    updatedDocs[sourceLibrary] = {
      ...(updatedDocs[sourceLibrary] || {}),
      [targetComponentName]: { ...rule.docs[sourceLibrary][sourceComponentName] }
    }

    updateRule(index, "docs", updatedDocs)
    setCopiedDocName(targetComponentName)

    // 3秒后清除复制状态
    setTimeout(() => {
      if (setCopiedDocName && copiedDocName === targetComponentName) {
        setCopiedDocName(null)
      }
    }, 3000)
  }

  // 导出所有文档为JSON
  const getExportJson = () => {
    if (!rule.docs) return "{}"
    return JSON.stringify(rule.docs, null, 2)
  }

  // 设置组件引用的回调函数
  const setComponentRef = (element: HTMLDivElement | null, componentName: string) => {
    if (element) {
      componentRefs.current.set(componentName, element)
    } else {
      componentRefs.current.delete(componentName)
    }
  }

  // 添加新的组件库
  const addNewLibrary = () => {
    if (!newLibraryName.trim()) {
      setLibraryError("组件库名称不能为空")
      return
    }

    if (libraries.includes(newLibraryName.trim())) {
      setLibraryError("该组件库已存在")
      return
    }

    // 更新组件库列表
    const updatedLibraries = [...libraries, newLibraryName.trim()]
    setLibraries(updatedLibraries)

    // 添加新的组件库到docs中
    const updatedDocs = { ...(rule.docs || {}) }
    updatedDocs[newLibraryName.trim()] = {}
    updateRule(index, "docs", updatedDocs)

    // 选择新添加的组件库
    setSelectedLibrary(newLibraryName.trim())

    // 重置状态
    setNewLibraryName("")
    setShowAddLibrary(false)
    setLibraryError(null)
  }

  // 删除组件库
  const deleteLibrary = (libraryName: string) => {
    if (!rule.docs || !rule.docs[libraryName]) return

    // 在删除前询问确认
    if (!window.confirm(`确定要删除组件库 "${libraryName}" 及其所有组件吗？`)) {
      return
    }

    // 更新组件库列表
    const updatedLibraries = libraries.filter(lib => lib !== libraryName)
    setLibraries(updatedLibraries)

    // 从docs中删除组件库
    const updatedDocs = { ...rule.docs }
    delete updatedDocs[libraryName]
    updateRule(index, "docs", updatedDocs)

    // 如果删除的是当前选中的组件库，则选择第一个组件库
    if (selectedLibrary === libraryName) {
      setSelectedLibrary(updatedLibraries[0] || "@private-basic-components")
    }

    // 从dataSet中删除该组件库的所有组件
    const componentsInLibrary = getComponentsInLibrary(libraryName)
    if (componentsInLibrary.length > 0 && rule.dataSet) {
      const updatedDataSet = rule.dataSet.filter(comp => !componentsInLibrary.includes(comp))
      updateRule(index, "dataSet", updatedDataSet)
    }
  }

  // 获取指定组件库中的所有组件
  const getComponentsInLibrary = (libraryName: string): string[] => {
    if (!rule.docs || !rule.docs[libraryName]) return []

    return Object.keys(rule.docs[libraryName])
  }

  // 获取当前选中库中的组件
  const getComponentsForSelectedLibrary = () => {
    if (!rule.docs || !rule.docs[selectedLibrary]) return []

    return Object.keys(rule.docs[selectedLibrary])
  }

  return (
    <div className="space-y-4">
      {/* 组件库选择和添加区域 */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">组件库管理</div>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => setShowAddLibrary(true)}
          >
            <PlusCircle className="h-4 w-4 mr-1" />
            添加组件库
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {libraries.map((lib) => (
            <div
              key={lib}
              className={`border rounded-md p-2 flex items-center gap-2 cursor-pointer
                ${selectedLibrary === lib ? 'bg-primary/10 border-primary' : 'bg-background hover:bg-muted/50'}`}
              onClick={() => setSelectedLibrary(lib)}
            >
              <span className="text-sm">{lib}</span>
              {lib !== libraries[0] && (
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 text-red-500 hover:bg-red-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteLibrary(lib);
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 组件添加区域 */}
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
                  if (error) setError(null)
                }}
                onKeyDown={e => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addComponentToDataSet(componentInput)
                  }
                }}
                className={error ? "border-red-500" : ""}
              />
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => addComponentToDataSet(componentInput)}
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
            onClick={() => setShowImportJson(true)}
            className="whitespace-nowrap"
          >
            <FileText className="h-4 w-4 mr-1" />
            导入文档
          </Button>
        </div>

        {/* 组件列表区域 - 显示当前组件库中的组件 */}
        <div className="space-y-2 mt-4">
          {getComponentsForSelectedLibrary().length > 0 ? (
            getComponentsForSelectedLibrary().map((componentName, i) => {
              const libraryName = selectedLibrary;
              const hasDocumentation = rule.docs && rule.docs[libraryName]?.[componentName];
              const isCopied = copiedDocName === componentName;
              const isImported = importedComponents.some(comp => comp.name === componentName);

              return (
                <div
                  key={i}
                  ref={(el) => setComponentRef(el, componentName)}
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
                              onClick={() => editPrivateComponentDocs(componentName)}
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
                                  onClick={() => {
                                    // 查找没有文档的组件
                                    const componentsWithoutDocs = getComponentsForSelectedLibrary()
                                      .filter(name => name !== componentName && !rule.docs?.[libraryName]?.[name]);

                                    if (componentsWithoutDocs.length > 0) {
                                      // 复制到第一个没有文档的组件
                                      copyDocsToComponent(componentName, componentsWithoutDocs[0])
                                    }
                                  }}
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
                                  onClick={() => removePrivateComponentDocs(componentName, libraryName)}
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
                                  onClick={() => openPreview(componentName)}
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

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              className="h-7 w-7 p-0 text-red-500"
                              onClick={() => {
                                const dataSet = rule.dataSet || [];
                                const index = dataSet.indexOf(componentName);
                                if (index !== -1) {
                                  removeComponentFromDataSet(index);
                                }
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>删除组件</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>

                  {hasDocumentation && (
                    <div className="text-xs text-muted-foreground flex items-center mt-1">
                      <div className="mr-2 flex items-center">
                        <Code className="h-3 w-3 mr-1" />
                        <span>API文档</span>
                      </div>
                      <div className="flex items-center ml-2 cursor-pointer text-blue-500" onClick={() => openPreview(componentName)}>
                        <Eye className="h-3 w-3 mr-1" />
                        <span>预览文档</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-sm text-muted-foreground text-center py-4 border border-dashed rounded-md">
              该组件库未添加任何组件
            </div>
          )}
        </div>
      </div>

      <div className="text-xs bg-blue-50 p-3 rounded-md border border-blue-100 mt-4">
        <div className="flex">
          <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
          <div className="text-blue-700">
            <p className="font-medium mb-1">私有组件配置说明</p>
            <p>私有组件库配置提供以下功能：</p>
            <ul className="list-disc ml-4 mt-1">
              <li>管理多个组件库，便于组织不同类型的组件</li>
              <li>为每个组件添加详细的描述和API文档</li>
              <li>支持批量导入/导出组件文档</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 添加组件库对话框 */}
      <Dialog open={showAddLibrary} onOpenChange={setShowAddLibrary}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>添加新组件库</DialogTitle>
            <DialogDescription>
              输入新组件库的名称，推荐使用 @scope/name 格式
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              placeholder="例如: @private-ui/basic"
              value={newLibraryName}
              onChange={(e) => {
                setNewLibraryName(e.target.value)
                if (libraryError) setLibraryError(null)
              }}
              className={libraryError ? "border-red-500" : ""}
            />
            {libraryError && <p className="text-red-500 text-xs">{libraryError}</p>}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowAddLibrary(false)}>
              取消
            </Button>
            <Button onClick={addNewLibrary}>
              添加
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 组件文档编辑器 */}
      {showDocsEditor && (
        <Card className="mt-4 border-primary/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center justify-between">
              <span>
                编辑 {showDocsEditor.componentName} 组件文档
                <Badge variant="outline" className="ml-2 text-xs">{showDocsEditor.libraryName}</Badge>
              </span>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0"
                onClick={() => setShowDocsEditor(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-xs mb-1 font-medium">组件描述</p>
              <Textarea
                placeholder="请输入组件的详细描述..."
                value={componentDocs.description}
                onChange={e => setComponentDocs({...componentDocs, description: e.target.value})}
                className="min-h-[100px] text-sm"
              />
            </div>
            <div>
              <p className="text-xs mb-1 font-medium">API 文档</p>
              <Textarea
                placeholder="请输入组件的API文档，支持Markdown格式..."
                value={componentDocs.api}
                onChange={e => setComponentDocs({...componentDocs, api: e.target.value})}
                className="min-h-[150px] text-sm font-mono"
              />
            </div>
            <div className="flex justify-end">
              <Button
                type="button"
                size="sm"
                onClick={() => addDocsToPrivateComponent(showDocsEditor.componentName, showDocsEditor.libraryName)}
              >
                保存文档
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* JSON导入对话框 */}
      <Dialog open={showImportJson} onOpenChange={setShowImportJson}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>导入/导出组件文档</DialogTitle>
            <DialogDescription>
              通过JSON格式批量导入或导出组件文档
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="import">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="import">导入文档</TabsTrigger>
              <TabsTrigger value="export">导出文档</TabsTrigger>
            </TabsList>

            <TabsContent value="import" className="pt-2">
              <div className="space-y-4">
                <p className="text-xs text-muted-foreground">
                  请粘贴JSON格式的组件文档，支持两种格式，将导入到当前选中的组件库 <Badge variant="outline">{selectedLibrary}</Badge>：
                </p>
                <div className="text-xs text-muted-foreground bg-gray-50 p-3 rounded-md">
                  <p className="font-medium mb-1">单库格式</p>
                  <pre className="overflow-x-auto my-1">{`{
  "Button": { "description": "按钮组件", "api": "API内容" },
  "Card": { "description": "卡片组件", "api": "API内容" }
}`}</pre>
                  <p className="font-medium mb-1 mt-2">多库格式</p>
                  <pre className="overflow-x-auto my-1">{`{
  "@private-basic-components": {
    "Button": { "description": "按钮组件", "api": "API内容" },
    "Card": { "description": "卡片组件", "api": "API内容" }
  },
  "@other-library": {
    "OtherComponent": { "description": "其他组件", "api": "API内容" }
  }
}`}</pre>
                </div>

                <Textarea
                  placeholder={`{\n  "Button": {\n    "description": "按钮组件",\n    "api": "## API\\n| 属性 | 说明 | 类型 | 默认值 |"\n  }\n}`}
                  value={jsonInput}
                  onChange={e => {
                    setJsonInput(e.target.value)
                    if (jsonError) setJsonError(null)
                  }}
                  className="min-h-[300px] font-mono text-sm"
                />

                {jsonError && <p className="text-red-500 text-xs">{jsonError}</p>}

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setShowImportJson(false)}>取消</Button>
                  <Button type="button" onClick={importFromJson}>导入</Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="export" className="pt-2">
              <div className="space-y-4">
                <p className="text-xs text-muted-foreground">
                  以下是当前配置的组件文档，你可以复制并保存以备后用
                </p>

                <div className="relative">
                  <Textarea
                    value={getExportJson()}
                    readOnly
                    className="min-h-[300px] font-mono text-sm"
                  />

                  <Button
                    type="button"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      navigator.clipboard.writeText(getExportJson())
                        .then(() => {
                          alert('已复制到剪贴板')
                        })
                        .catch(err => {
                          console.error('复制失败:', err)
                        })
                    }}
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    复制
                  </Button>
                </div>

                <div className="flex justify-end">
                  <Button type="button" variant="outline" onClick={() => setShowImportJson(false)}>关闭</Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* 文档预览对话框 */}
      {previewDocs && (
        <Dialog open={previewDocs.isOpen} onOpenChange={() => closePreview()}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl flex items-center">
                <span className="text-primary">{previewDocs.componentName}</span>
                <Badge variant="outline" className="ml-2 text-sm">{previewDocs.libraryName}</Badge>
                <span className="text-sm ml-2 text-muted-foreground">组件文档</span>
              </DialogTitle>
            </DialogHeader>

            <div className="mt-4 space-y-6">
              <div>
                <h3 className="text-md font-medium border-b pb-2">组件描述</h3>
                <div className="mt-2 whitespace-pre-wrap text-sm">{previewDocs.docs.description}</div>
              </div>

              <div>
                <h3 className="text-md font-medium border-b pb-2">API 文档</h3>
                <div className="mt-2 whitespace-pre-wrap text-sm font-mono bg-muted p-4 rounded-md overflow-x-auto">
                  {previewDocs.docs.api}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}