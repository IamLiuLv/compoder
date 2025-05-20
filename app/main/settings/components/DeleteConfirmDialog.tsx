import React from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Loader2 } from "lucide-react"

interface DeleteConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  isDeleting: boolean
  onConfirm: () => Promise<void>
  title?: string
  description?: string
  itemName?: string
}

export default function DeleteConfirmDialog({
  open,
  onOpenChange,
  isDeleting,
  onConfirm,
  title = "确认删除",
  itemName
}: DeleteConfirmDialogProps) {
  // 在确认删除后防止多次点击
  const handleConfirm = React.useCallback(async () => {
    if (isDeleting) return
    await onConfirm()
  }, [isDeleting, onConfirm])

  return (
    <Dialog open={open} onOpenChange={isDeleting ? undefined : onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {itemName ? (
              <>
                您确定要删除 <span className="font-medium">&ldquo;{itemName}&rdquo;</span> 吗？
                此操作无法撤销。
              </>
            ) : (
              <>确定要删除此配置吗？此操作无法撤销。</>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            取消
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                删除中...
              </span>
            ) : "删除"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}