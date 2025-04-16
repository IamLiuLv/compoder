import React, { useCallback, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { ArrowUpIcon } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/hooks/use-toast"
import { ChatInputProps } from "./interface"
import autosize from "autosize"
import { ImagePreview } from "@/components/biz/ImagePreview"
import { motion, AnimatePresence } from "framer-motion"

const ChatInput = React.memo(
  ({
    value,
    onChange,
    actions,
    onSubmit,
    loading,
    handleInputChange,
    disabled,
    images,
    onImageRemove,
    loadingSlot,
    className,
  }: ChatInputProps) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    // Initialize autosize
    useEffect(() => {
      if (textareaRef.current) {
        autosize(textareaRef.current)
      }

      // Cleanup function
      return () => {
        if (textareaRef.current) {
          autosize.destroy(textareaRef.current)
        }
      }
    }, [])

    // Update autosize when value changes
    useEffect(() => {
      if (textareaRef.current) {
        autosize.update(textareaRef.current)
      }
    }, [value])

    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        // Skip if IME is composing
        if (event.nativeEvent.isComposing) {
          return
        }

        if (event.key === "Enter") {
          if (event.shiftKey) {
            // Insert newline when Shift + Enter is pressed
            const target = event.target as HTMLTextAreaElement
            const start = target.selectionStart
            const end = target.selectionEnd
            const newValue =
              value.substring(0, start) + "\n" + value.substring(end)
            onChange?.(newValue)

            // Prevent default newline behavior
            event.preventDefault()

            // Set cursor position in next event loop
            setTimeout(() => {
              target.selectionStart = target.selectionEnd = start + 1
              autosize.update(target)
            }, 0)
          } else {
            // Submit when only Enter is pressed
            event.preventDefault()
            if (value.trim()) {
              onSubmit()
            } else {
              toast({
                title: "Warning",
                description: "Please input your message",
                variant: "default",
              })
            }
          }
        }
      },
      [value, onChange, onSubmit],
    )

    return (
      <div className={cn("w-full space-y-4", className)}>
        <div
          className={cn(
            "relative rounded-lg",
            "bg-background",
            loading
              ? "border-0 bg-gradient-to-r from-[#ff0000] via-[#800080] via-[#0000ff] to-[#008000] p-[2px] bg-[length:200%_200%] animate-gradient"
              : "border",
          )}
        >
          <div
            className={cn("relative h-full w-full bg-background rounded-lg")}
          >
            {/* Loading slot */}
            <AnimatePresence>
              {loading && loadingSlot && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="p-2">{loadingSlot}</div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Image preview area */}
            {images && images.length > 0 && (
              <div className="flex flex-wrap gap-1.5 p-2">
                {images.map((image, index) => (
                  <ImagePreview
                    key={index}
                    src={image}
                    onRemove={
                      onImageRemove ? () => onImageRemove(index) : undefined
                    }
                  />
                ))}
              </div>
            )}

            {/* Textarea */}
            <Textarea
              ref={textareaRef}
              value={value}
              disabled={disabled || loading}
              onChange={event => {
                onChange?.(event.target.value)
                handleInputChange?.(event)
              }}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              rows={1}
              className={cn(
                "max-h-[100px] min-h-[44px] resize-none border-0 focus-visible:ring-0 overflow-y-auto",
                disabled && "opacity-50 cursor-not-allowed",
              )}
            />

            {/* Action Bar */}
            <div className="flex items-center justify-between bg-background px-4 py-2 rounded-b-lg">
              {/* Left side - Action buttons */}
              <div className="flex items-center space-x-2">
                {actions &&
                  actions.length > 0 &&
                  actions.map((action, index) => (
                    <React.Fragment key={index}>
                      {action}
                      {index < actions.length - 1 && (
                        <Separator orientation="vertical" className="h-4" />
                      )}
                    </React.Fragment>
                  ))}
              </div>

              {/* Right side - Hint and Submit button */}
              <div className="flex items-center gap-2">
                {value.trim() && (
                  <span className="text-xs text-muted-foreground">
                    Use{" "}
                    <kbd className="px-1 py-0.5 rounded-md bg-muted text-muted-foreground border">
                      Shift
                    </kbd>{" "}
                    +{" "}
                    <kbd className="px-1 py-0.5 rounded-md bg-muted text-muted-foreground border">
                      Return
                    </kbd>{" "}
                    for a new line
                  </span>
                )}

                <Button
                  size="icon"
                  variant="default"
                  className={cn(
                    "bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-80",
                    loading &&
                      "animate-pulse cursor-not-allowed pointer-events-none",
                  )}
                  disabled={disabled}
                  onClick={() => {
                    if (!value.trim()) {
                      toast({
                        title: "Warning",
                        description: "Please input your message",
                        variant: "default",
                      })
                      return
                    }
                    onSubmit()
                  }}
                >
                  <ArrowUpIcon className="h-4 w-4 text-white/80" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  },
)

ChatInput.displayName = "ChatInput"

export default ChatInput
