import { ReactNode } from "react"

export interface CodingBoxProps {
  code?: string
  className?: string
  setShowCodeDetail?: (open: boolean) => void
  showCodeDetail?: boolean
  showMacControls?: boolean
  showJumpPrompt?: boolean
  onJumpConfirm?: () => void
  onJumpCancel?: () => void
  onOpenChange?: (open: boolean) => void // 新增属性
  newComponentId?: string
  isSubmitting?: boolean
}

export interface CodeDetailDialogProps {
  isOpen: boolean
  setShowCodeDetail: (open: boolean) => void
  code: string
  showJumpPrompt?: boolean
  onJumpConfirm?: () => void
  onJumpCancel?: () => void
  newComponentId?: string
}

export interface CodeInfo {
  language: string
  fileName: string
  content: string
}

export interface MarkdownComponentProps {
  node?: any
  inline?: boolean
  className?: string
  children: ReactNode
  [key: string]: any
}
