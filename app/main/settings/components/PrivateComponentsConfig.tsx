import React, { useState, useRef, useEffect } from "react"
import { AlertCircle } from "lucide-react"
import { Rule } from "./types"
import {
  LibrarySelector,
  ComponentList,
  AddLibraryDialog,
  DocsEditor,
  ImportExportDialog,
  PreviewDialog
} from "./private-components"

interface PrivateComponentsConfigProps {
  rule: Rule
  index: number
  updateRule: (index: number, field: string, value: any) => void
}

export default function PrivateComponentsConfig({ rule, index, updateRule }: PrivateComponentsConfigProps) {
  // 组件库列表状态
  const [libraries, setLibraries] = useState<string[]>(() => {
    if (!rule.docs) return [];
    return Object.keys(rule.docs).length > 0 ? Object.keys(rule.docs) : [];
  });

  // 当前选中的组件库
  const [selectedLibrary, setSelectedLibrary] = useState<string>(libraries[0] || "");

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
      setSelectedLibrary(updatedLibraries[0] || "")
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

  // 获取组件所属的库
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

  // 添加组件到 dataSet 和当前选中的组件库
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
  const addDocsToPrivateComponent = () => {
    if (!showDocsEditor) return

    // 如果docs不存在，创建一个空对象
    const docs = rule.docs || {}
    const updatedDocs = {
      ...docs,
      [showDocsEditor.libraryName]: {
        ...(docs[showDocsEditor.libraryName] || {}),
        [showDocsEditor.componentName]: componentDocs
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
    if (previewDocs) {
      setPreviewDocs({...previewDocs, isOpen: false})
      setTimeout(() => setPreviewDocs(null), 300) // 等待动画结束
    }
  }

  // 复制文档到另一个组件
  const copyDocsToComponent = (sourceComponentName: string) => {
    // 查找没有文档的组件
    const componentsWithoutDocs = getComponentsInLibrary(selectedLibrary)
      .filter(name => name !== sourceComponentName && !rule.docs?.[selectedLibrary]?.[name])

    if (componentsWithoutDocs.length === 0) return

    const targetComponentName = componentsWithoutDocs[0]
    const sourceLibrary = selectedLibrary

    if (!rule.docs || !rule.docs[sourceLibrary]?.[sourceComponentName] || sourceComponentName === targetComponentName) return

    const updatedDocs = { ...rule.docs }

    // 使用当前选中的组件库
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

  return (
    <div className="space-y-4">
      {/* 组件库选择器 */}
      <LibrarySelector
        libraries={libraries}
        selectedLibrary={selectedLibrary}
        onSelectLibrary={setSelectedLibrary}
        onAddLibrary={() => setShowAddLibrary(true)}
        onDeleteLibrary={deleteLibrary}
      />

      {/* 组件列表 */}
      <ComponentList
        rule={rule}
        selectedLibrary={selectedLibrary}
        componentInput={componentInput}
        error={error}
        copiedDocName={copiedDocName}
        importedComponents={importedComponents}
        setComponentInput={setComponentInput}
        addComponent={addComponentToDataSet}
        clearError={() => setError(null)}
        onShowImport={() => setShowImportJson(true)}
        onEditDocs={editPrivateComponentDocs}
        onCopyDocs={copyDocsToComponent}
        onDeleteDocs={removePrivateComponentDocs}
        onPreviewDocs={openPreview}
        setComponentRef={setComponentRef}
      />

      {/* 组件库说明信息 */}
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
      <AddLibraryDialog
        open={showAddLibrary}
        onOpenChange={setShowAddLibrary}
        libraryName={newLibraryName}
        error={libraryError}
        onChange={setNewLibraryName}
        onSubmit={addNewLibrary}
        clearError={() => setLibraryError(null)}
      />

      {/* 组件文档编辑器 */}
      {showDocsEditor && (
        <DocsEditor
          open={!!showDocsEditor}
          onOpenChange={(open) => {
            if (!open) setShowDocsEditor(null);
          }}
          componentName={showDocsEditor.componentName}
          libraryName={showDocsEditor.libraryName}
          docs={componentDocs}
          onChange={setComponentDocs}
          onSave={addDocsToPrivateComponent}
        />
      )}

      {/* JSON导入对话框 */}
      <ImportExportDialog
        open={showImportJson}
        onOpenChange={setShowImportJson}
        selectedLibrary={selectedLibrary}
        jsonInput={jsonInput}
        jsonError={jsonError}
        onJsonInputChange={setJsonInput}
        onImport={importFromJson}
        onClearError={() => setJsonError(null)}
        exportJson={getExportJson()}
      />

      {/* 文档预览对话框 */}
      {previewDocs && (
        <PreviewDialog
          open={previewDocs.isOpen}
          onOpenChange={closePreview}
          componentName={previewDocs.componentName}
          libraryName={previewDocs.libraryName}
          docs={previewDocs.docs}
        />
      )}
    </div>
  )
}