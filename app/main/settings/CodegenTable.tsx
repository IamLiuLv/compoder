import { useEffect, useState } from "react"
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/artifacts/shadcn-ui-renderer/components/ui/table"
import { Button } from "@/components/ui/button"
import { getCodegenList, getCodegenDetail, createCodegen, editCodegen, deleteCodegen } from "@/app/services/codegen/codegen.service"
import CodegenEditDialog from "./components/CodegenEditDialog"
import DeleteConfirmDialog from "./components/DeleteConfirmDialog"
import { Codegen, CodegenListItem } from "./components/types"

export default function CodegenTable() {
  const [list, setList] = useState<CodegenListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<CodegenListItem | null>(null)
  const [form, setForm] = useState<Partial<Codegen>>({
    title: "",
    description: "",
    fullStack: "React",
    guides: [],
    model: "",
    codeRendererUrl: "",
    rules: []
  })
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  // 删除确认相关状态
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<string | undefined>(undefined)
  const [deleteLoading, setDeleteLoading] = useState(false)

  // Codegen 列表
  const load = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await getCodegenList({ page: 1, pageSize: 100 })
      // 类型转换以满足TypeScript要求
      setList(res.data || [])
    } catch (err) {
      console.error("加载Codegen列表失败:", err)
      setError("加载数据失败，请稍后重试")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  // 打开弹窗
  const handleEdit = async (item: CodegenListItem | null) => {
    if (!item) {
      // 新增时使用默认值
      setEditing(null)
      setForm({
        title: "",
        description: "",
        fullStack: "React",
        guides: [],
        model: "",
        codeRendererUrl: "",
        rules: []
      })
      setOpen(true)
      return
    }

    try {
      // 编辑时通过detail接口获取完整信息
      setFormLoading(true)
      setFormError(null)
      const result = await getCodegenDetail({ id: item._id || "" })
      if (result && result.data) {
        const detailData = result.data as Partial<Codegen>
        setEditing(item)
        setForm({
          ...detailData,
          guides: detailData.guides || [],
          model: detailData.model || "",
          rules: detailData.rules || []
        })
      } else {
        throw new Error("获取详情失败")
      }
    } catch (error) {
      console.error("获取Codegen详情失败:", error)
      setFormError("获取详情失败，请重试")
      // 降级使用列表数据
      setEditing(item)
      setForm({
        ...item,
        guides: item.guides || [],
        model: "",
        rules: item.rules || []
      })
    } finally {
      setFormLoading(false)
      setOpen(true)
    }
  }

  // 提交
  const handleSubmit = async () => {
    try {
      // 确保所有必需字段都有值
      if (!form.title || !form.description || !form.model || !form.codeRendererUrl) {
        setFormError("请填写所有必填字段：标题、描述、模型和渲染器URL")
        return
      }

      // 准备提交数据，确保guides和rules字段是数组
      const submitData = {
        ...form,
        guides: Array.isArray(form.guides) ? form.guides : [],
        rules: Array.isArray(form.rules) ? form.rules : []
      }

      if (editing && editing._id) {
        await editCodegen({ ...submitData, _id: editing._id })
      } else {
        await createCodegen(submitData)
      }
      setOpen(false)
      load()
    } catch (err) {
      console.error("保存Codegen失败:", err)
      setFormError((err as Error).message || "保存失败，请重试")
    }
  }

  // 打开删除确认对话框
  const openDeleteConfirm = (item?: CodegenListItem) => {
    if (!item || !item._id) {
      console.error("删除失败: 缺少ID或项目信息")
      return
    }
    setItemToDelete(item._id)
    setDeleteConfirmOpen(true)
  }

  // 执行删除操作
  const confirmDelete = async () => {
    if (!itemToDelete) return

    try {
      setDeleteLoading(true)
      await deleteCodegen(itemToDelete)
      setDeleteConfirmOpen(false)
      setItemToDelete(undefined)
      await load() // 重新加载列表
    } catch (err) {
      console.error("删除Codegen失败:", err)
      // 这里可以添加错误提示UI
    } finally {
      setDeleteLoading(false)
    }
  }

  if (loading) {
    return <div className="p-4 text-center">加载中...</div>
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        {error}
        <Button onClick={load} className="ml-2" size="sm">重试</Button>
      </div>
    )
  }

  return (
    <div className="p-4">
      <div className="my-4 flex justify-end">
        <Button onClick={() => handleEdit(null)}>新增</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>标题</TableHead>
            <TableHead>描述</TableHead>
            <TableHead>类型</TableHead>
            <TableHead>操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {list.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4">暂无数据</TableCell>
            </TableRow>
          ) : (
            list.map(item => (
              <TableRow key={item._id}>
                <TableCell>{item.title}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>{item.fullStack}</TableCell>
                <TableCell>
                  <Button size="sm" onClick={() => handleEdit(item)} className="mr-2">编辑</Button>
                  <Button size="sm" variant="destructive" onClick={() => openDeleteConfirm(item)}>删除</Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* 使用抽离的编辑对话框组件 */}
      <CodegenEditDialog
        open={open}
        onOpenChange={setOpen}
        editing={editing}
        formData={form}
        formLoading={formLoading}
        formError={formError}
        onFormChange={setForm}
        onSubmit={handleSubmit}
        onRetry={() => handleEdit(editing)}
      />

      {/* 使用抽离的删除确认对话框组件 */}
      <DeleteConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        isDeleting={deleteLoading}
        onConfirm={confirmDelete}
        itemName={list.find(item => item._id === itemToDelete)?.title}
      />
    </div>
  )
}