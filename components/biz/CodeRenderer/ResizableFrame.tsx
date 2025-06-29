import React, { useRef, useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"

interface ResizableFrameProps {
  width: string | number
  height: string | number
  onResize: (width: number, height: number) => void
  children: React.ReactNode
  className?: string
  minWidth?: number
  minHeight?: number
  maxWidth?: number
  maxHeight?: number
}

export const ResizableFrame: React.FC<ResizableFrameProps> = ({
  width,
  height,
  onResize,
  children,
  className,
  minWidth = 320,
  minHeight = 240,
  maxWidth,
  maxHeight,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isResizing, setIsResizing] = useState(false)
  const [resizeDirection, setResizeDirection] = useState<
    "right" | "bottom" | "corner" | null
  >(null)
  const [dimensions, setDimensions] = useState({
    width: typeof width === "number" ? width : parseInt(width) || 800,
    height: typeof height === "number" ? height : parseInt(height) || 600,
  })

  const startResizePosition = useRef({ x: 0, y: 0 })
  const startResizeSize = useRef({ width: 0, height: 0 })

  // Parse dimensions from props
  useEffect(() => {
    const newWidth =
      typeof width === "string" && width.includes("%")
        ? 800
        : typeof width === "number"
          ? width
          : parseInt(width) || 800

    const newHeight =
      typeof height === "string" && height.includes("%")
        ? 600
        : typeof height === "number"
          ? height
          : parseInt(height) || 600

    setDimensions({ width: newWidth, height: newHeight })
  }, [width, height])

  // Start resize operation
  const startResize = (
    e: React.PointerEvent,
    direction: "right" | "bottom" | "corner",
  ) => {
    // Prevent event bubbling to avoid affecting parent components
    e.stopPropagation()
    e.preventDefault()

    setIsResizing(true)
    setResizeDirection(direction)
    startResizePosition.current = { x: e.clientX, y: e.clientY }

    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect()
      startResizeSize.current = { width, height }
    } else {
      startResizeSize.current = dimensions
    }

    // Set pointer capture to ensure events continue even if mouse moves outside the element
    if (e.currentTarget) {
      e.currentTarget.setPointerCapture(e.pointerId)
    }
  }

  // Handle resize with pointer movement
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isResizing) return

    e.stopPropagation()
    e.preventDefault()

    const deltaX = e.clientX - startResizePosition.current.x
    const deltaY = e.clientY - startResizePosition.current.y

    // Apply a scaling factor of 1 for direct 1:1 movement
    const scaleFactor = 2
    let newWidth = dimensions.width
    let newHeight = dimensions.height

    // Calculate new dimensions based on drag direction, ensuring precise scaling ratio
    if (resizeDirection === "right" || resizeDirection === "corner") {
      newWidth = Math.max(
        minWidth,
        startResizeSize.current.width + deltaX * scaleFactor,
      )
      if (maxWidth) newWidth = Math.min(maxWidth, newWidth)
    }

    if (resizeDirection === "bottom" || resizeDirection === "corner") {
      newHeight = Math.max(
        minHeight,
        startResizeSize.current.height + deltaY * scaleFactor,
      )
      if (maxHeight) newHeight = Math.min(maxHeight, newHeight)
    }

    // Use precise integer values to avoid potential rounding issues
    setDimensions({
      width: Math.round(newWidth),
      height: Math.round(newHeight),
    })
    onResize(Math.round(newWidth), Math.round(newHeight))
  }

  // End resize operation
  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isResizing) return

    e.stopPropagation()

    setIsResizing(false)
    setResizeDirection(null)

    // Release capture
    if (e.currentTarget) {
      e.currentTarget.releasePointerCapture(e.pointerId)
    }
  }

  return (
    <div className="relative">
      {/* Size display - moved outside and above the card */}
      <div className="absolute top-0 right-0 -mt-7 text-xs bg-background/80 text-muted-foreground px-2 py-1 rounded text-[11px] border z-50">
        {Math.round(dimensions.width)} × {Math.round(dimensions.height)}
      </div>

      <Card
        ref={containerRef}
        className={cn("relative overflow-hidden pr-6 pb-6", className)}
        style={{
          width: dimensions.width,
          height: dimensions.height,
          maxWidth: "calc(100vw - 3rem)",
          maxHeight: "calc(100vh - 8rem)",
        }}
      >
        {children}

        {/* Right resize handle */}
        <div
          className="absolute top-1 right-1 w-4 h-full cursor-ew-resize z-30 flex items-center"
          onPointerDown={e => startResize(e, "right")}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          style={{ touchAction: "none" }}
        >
          <div className="w-1 h-16 bg-primary/40 hover:bg-primary/60 rounded-sm mx-auto" />
        </div>

        {/* Bottom resize handle */}
        <div
          className="absolute bottom-1 left-1 w-full h-4 cursor-ns-resize z-30 flex justify-center"
          onPointerDown={e => startResize(e, "bottom")}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          style={{ touchAction: "none" }}
        >
          <div className="h-1 w-16 bg-primary/40 hover:bg-primary/60 rounded-sm my-auto" />
        </div>

        {/* Bottom-right corner resize handle */}
        <div
          className="absolute bottom-1 right-1 w-6 h-6 cursor-nwse-resize z-40 flex items-center justify-center"
          onPointerDown={e => startResize(e, "corner")}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          style={{ touchAction: "none" }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-muted-foreground hover:text-primary"
          >
            <path
              d="M2 12L12 2"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M8 12L12 8"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              transform="translate(0, 2)"
            />
          </svg>
        </div>
      </Card>
    </div>
  )
}
