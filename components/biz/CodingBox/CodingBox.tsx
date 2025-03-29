import React, { useRef } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import type { CodingBoxProps } from "./interface"
import { useScrollToBottom } from "@/hooks/use-scroll"
import { MatrixRain } from "../MatrixRain"
import CodeDetailDialog from "./components/CodeDetailDialog"

const CONTAINER_STYLES = {
  base: "rounded-lg overflow-hidden shadow-lg relative",
  theme: "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800",
} as const

interface MacControlsProps {
  onFullScreen: () => void;
}

const MacControls: React.FC<MacControlsProps> = ({ onFullScreen }) => (
  <div className="h-7 flex items-center px-4 bg-zinc-100 dark:bg-zinc-800 relative">
    <div className="flex gap-2 group">
      <MacButton color="#FF5F56" label="close">
        <svg width="8" height="8" viewBox="0 0 8 8">
          <path d="M1.5 1.5L6.5 6.5M6.5 1.5L1.5 6.5" stroke="#4A0002" strokeWidth="1" strokeLinecap="round"/>
        </svg>
      </MacButton>
      <MacButton color="#FFBD2E" label="minimize">
        <svg width="8" height="8" viewBox="0 0 8 8">
          <path d="M1.5 4H6.5" stroke="#4A0002" strokeWidth="1" strokeLinecap="round"/>
        </svg>
      </MacButton>
      <MacButton color="#27C93F" label="maximize" onClick={onFullScreen}>
        <svg width="8" height="8" viewBox="0 0 8 8">
          <path d="M4 1.5V6.5M1.5 4H6.5" stroke="#4A0002" strokeWidth="1" strokeLinecap="round"/>
        </svg>
      </MacButton>
    </div>
  </div>
)

interface MacButtonProps {
  color: string;
  label: string;
  onClick?: () => void;
  children: React.ReactNode;
}

const MacButton: React.FC<MacButtonProps> = ({ color, label, onClick, children }) => (
  <button
    className={`w-3 h-3 rounded-full hover:${color}/80 transition-colors duration-200 relative`}
    style={{ backgroundColor: color }}
    aria-label={label}
    onClick={onClick}
  >
    <span className="opacity-0 group-hover:opacity-100 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      {children}
    </span>
  </button>
)

const CodingBox: React.FC<CodingBoxProps> = ({
  code = '',
  className,
  showMacControls = true,
  showJumpPrompt = false,
  onJumpConfirm,
  onJumpCancel,
  showCodeDetail = false,
  setShowCodeDetail = () => {},
  newComponentId,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null)
  useScrollToBottom(scrollRef, [code])

  return (
    <div className={cn(CONTAINER_STYLES.base, CONTAINER_STYLES.theme, className)}>
      <MatrixRain />
      {showMacControls && <MacControls onFullScreen={() => setShowCodeDetail(true)} />}
      <ScrollArea
        ref={scrollRef}
        className="h-[calc(100%-28px)] p-4 font-mono text-sm relative"
      >
        <pre className="whitespace-pre-wrap dark:text-[#00ff00] text-emerald-700 relative z-10">
          {code}
        </pre>
      </ScrollArea>

      <CodeDetailDialog
        isOpen={showCodeDetail}
        setShowCodeDetail={setShowCodeDetail}
        code={code}
        showJumpPrompt={showJumpPrompt}
        onJumpConfirm={onJumpConfirm}
        onJumpCancel={onJumpCancel}
        newComponentId={newComponentId}
      />
    </div>
  )
}

export default CodingBox
