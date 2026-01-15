import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Copy } from "lucide-react";

interface ImportExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedLibrary: string;
  jsonInput: string;
  jsonError: string | null;
  onJsonInputChange: (value: string) => void;
  onImport: () => void;
  onClearError: () => void;
  exportJson: string;
}

export function ImportExportDialog({
  open,
  onOpenChange,
  selectedLibrary,
  jsonInput,
  jsonError,
  onJsonInputChange,
  onImport,
  onClearError,
  exportJson
}: ImportExportDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
                  onJsonInputChange(e.target.value);
                  if (jsonError) onClearError();
                }}
                className="min-h-[300px] font-mono text-sm"
              />

              {jsonError && <p className="text-red-500 text-xs">{jsonError}</p>}

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>取消</Button>
                <Button type="button" onClick={onImport}>导入</Button>
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
                  value={exportJson}
                  readOnly
                  className="min-h-[300px] font-mono text-sm"
                />

                <Button
                  type="button"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => {
                    navigator.clipboard.writeText(exportJson)
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
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>关闭</Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}