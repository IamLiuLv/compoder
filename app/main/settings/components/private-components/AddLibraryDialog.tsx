import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AddLibraryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  libraryName: string;
  error: string | null;
  onChange: (value: string) => void;
  onSubmit: () => void;
  clearError: () => void;
}

export function AddLibraryDialog({
  open,
  onOpenChange,
  libraryName,
  error,
  onChange,
  onSubmit,
  clearError
}: AddLibraryDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            value={libraryName}
            onChange={(e) => {
              onChange(e.target.value);
              if (error) clearError();
            }}
            className={error ? "border-red-500" : ""}
          />
          {error && <p className="text-red-500 text-xs">{error}</p>}
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={onSubmit}>
            添加
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}