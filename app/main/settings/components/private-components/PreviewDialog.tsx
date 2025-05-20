import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface PreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  componentName: string;
  libraryName: string;
  docs: {
    description: string;
    api: string;
  };
}

export function PreviewDialog({
  open,
  onOpenChange,
  componentName,
  libraryName,
  docs
}: PreviewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center">
            <span className="text-primary">{componentName}</span>
            <Badge variant="outline" className="ml-2 text-sm">{libraryName}</Badge>
            <span className="text-sm ml-2 text-muted-foreground">组件文档</span>
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-6">
          <div>
            <h3 className="text-md font-medium border-b pb-2">组件描述</h3>
            <div className="mt-2 whitespace-pre-wrap text-sm">{docs.description}</div>
          </div>

          <div>
            <h3 className="text-md font-medium border-b pb-2">API 文档</h3>
            <div className="mt-2 whitespace-pre-wrap text-sm font-mono bg-muted p-4 rounded-md overflow-x-auto">
              {docs.api}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}