import React from "react"
import { Button } from "@/components/ui/button"
import { Trash2, PlusCircle } from "lucide-react"

interface LibrarySelectorProps {
  libraries: string[]
  selectedLibrary: string
  onSelectLibrary: (library: string) => void
  onAddLibrary: () => void
  onDeleteLibrary: (library: string) => void
}

export function LibrarySelector({
  libraries,
  selectedLibrary,
  onSelectLibrary,
  onAddLibrary,
  onDeleteLibrary
}: LibrarySelectorProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">组件库管理</div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={onAddLibrary}
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
            onClick={() => onSelectLibrary(lib)}
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
                  onDeleteLibrary(lib);
                }}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}