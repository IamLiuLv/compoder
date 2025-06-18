import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

interface DocsEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  componentName: string;
  libraryName: string;
  docs: {description: string, api: string};
  onChange: (docs: {description: string, api: string}) => void;
  onSave: () => void;
}

export function DocsEditor({
  open,
  onOpenChange,
  componentName,
  libraryName,
  docs,
  onChange,
  onSave
}: DocsEditorProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <span>编辑组件文档</span>
            <span className="text-primary ml-2">{componentName}</span>
            <Badge variant="outline" className="ml-2 text-xs">{libraryName}</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <p className="text-sm font-medium mb-2">组件描述</p>
            <Textarea
              placeholder="请输入组件的详细描述..."
              value={docs.description}
              onChange={e => onChange({...docs, description: e.target.value})}
              className="min-h-[120px] text-sm"
            />
          </div>
          <div>
            <p className="text-sm font-medium mb-2">API 文档</p>
            <Textarea
              placeholder="请输入组件的API文档，支持Markdown格式..."
              value={docs.api}
              onChange={e => onChange({...docs, api: e.target.value})}
              className="min-h-[200px] text-sm font-mono"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            取消
          </Button>
          <Button
            type="button"
            onClick={() => {
              onSave();
              onOpenChange(false);
            }}
          >
            保存文档
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}