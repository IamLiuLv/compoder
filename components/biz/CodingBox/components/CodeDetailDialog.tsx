import React from "react"
import ReactMarkdown from 'react-markdown';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { MatrixRain } from "../../MatrixRain"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism"
import { useTheme } from "next-themes"
import { CodeDetailDialogProps, CodeInfo, MarkdownComponentProps } from "../interface"
import { Button } from "@/components/ui/button"

// 常量配置
const CONSTANTS = {
  SYNTAX_HIGHLIGHTER_STYLE: {
    margin: 0,
    borderRadius: '0.5rem',
    marginTop: '1rem',
    marginBottom: '1rem',
  },
  CLOSE_BUTTON_COLOR: '#FF5F56',
  CLOSE_BUTTON_HOVER_COLOR: 'rgba(255, 95, 86, 0.8)',
} as const;

// 工具函数：解析代码块
function parseCodeBlock(code: string): CodeInfo[] {
  const results: CodeInfo[] = [];
  let lastIndex = 0;
  
  // 移除 ComponentArtifact 标签
  code = code.replace(/<ComponentArtifact\s+name="[^"]+"\s*>\n?/g, '')
            .replace(/<\/ComponentArtifact>\n?/g, '');
  
  // 匹配 ComponentFile，包括未闭合的标签
  const fileRegex = /<ComponentFile\s+fileName="([^"]+)"(?:\s+isEntryFile="([^"]+)")?\s*>([\s\S]*?)(?:<\/ComponentFile>|$)/g;
  
  let match;
  while ((match = fileRegex.exec(code)) !== null) {
    if (match.index! > lastIndex) {
      const text = code.slice(lastIndex, match.index).trim();
      if (text) {
        results.push({ language: 'text', fileName: '', content: text });
      }
    }
    
    const [, fileName, , content] = match;
    const fileExtension = fileName.split('.').pop() || '';
    const trimmedContent = content.replace(/^\n+/, '');
    results.push({ language: fileExtension, fileName, content: trimmedContent });
    
    lastIndex = match.index! + match[0].length;
  }
  
  const remainingText = code.slice(lastIndex).trim();
  if (remainingText) {
    const codeBlockMatch = remainingText.match(/^```(\w+):(.+?)\n([\s\S]*?)```$/m);
    
    if (codeBlockMatch) {
      const [, language, fileName, content] = codeBlockMatch;
      results.push({ language, fileName, content: content.trim() });
    } else {
      results.push({ language: 'text', fileName: '', content: remainingText });
    }
  }
  
  return results.length > 0 ? results : [{ language: 'text', fileName: '', content: code }];
}

// 子组件：标题栏
const TitleBar: React.FC<{
  fileName: string;
  language: string;
  onClose: () => void;
}> = React.memo(({ fileName, language, onClose }) => (
  <div className="h-7 flex items-center px-4 bg-zinc-100 dark:bg-zinc-800 relative">
    <div className="flex items-center justify-between w-full">
      <div className="flex gap-2 group">
        <button
          className="w-3 h-3 rounded-full transition-colors duration-200 relative"
          style={{
            backgroundColor: CONSTANTS.CLOSE_BUTTON_COLOR,
          }}
          onClick={onClose}
        >
          <span className="opacity-0 group-hover:opacity-100 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <svg width="8" height="8" viewBox="0 0 8 8">
              <path d="M1.5 1.5L6.5 6.5M6.5 1.5L1.5 6.5" stroke="#4A0002" strokeWidth="1" strokeLinecap="round"/>
            </svg>
          </span>
        </button>
      </div>
      <div className="flex items-center gap-2">
        {fileName && (
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            {fileName}
          </span>
        )}
        {language !== 'text' && (
          <span className="text-xs px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300">
            {language}
          </span>
        )}
      </div>
    </div>
  </div>
));

TitleBar.displayName = 'TitleBar';

// 子组件：代码内容
const CodeContent: React.FC<{
  markdownContent: string;
  language: string;
}> = React.memo(({ markdownContent, language }) => {
  const { resolvedTheme } = useTheme();

  return (
    <ScrollArea className="h-[calc(100vh-120px)] relative">
      <div className="p-4 font-mono text-sm">
        <ReactMarkdown
          components={{
            code({ inline, className, children, ...props }: MarkdownComponentProps) {
              const match = /language-(\w+)/.exec(className || '')
              return !inline ? (
                <SyntaxHighlighter
                  style={resolvedTheme === 'light' ? oneLight : oneDark}
                  language={match ? match[1] : language}
                  PreTag="div"
                  customStyle={CONSTANTS.SYNTAX_HIGHLIGHTER_STYLE}
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code className={cn(
                  className,
                  'dark:text-[#00ff00] text-emerald-700',
                  'px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800'
                )} {...props}>
                  {children}
                </code>
              )
            },
            h3: (_props: React.HTMLAttributes<HTMLHeadingElement>) => (
              <h3 className="text-lg font-semibold mt-6 mb-2 text-zinc-800 dark:text-zinc-200">
                {_props.children}
              </h3>
            )
          }}
        >
          {markdownContent}
        </ReactMarkdown>
      </div>
    </ScrollArea>
  );
});

CodeContent.displayName = 'CodeContent';

// 子组件：跳转提示对话框
const JumpPromptDialog: React.FC<{
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}> = React.memo(({ open, onCancel, onConfirm }) => (
  <Dialog open={open}>
    <DialogContent className="z-[100]">
      <DialogHeader>
        <DialogTitle>New Component Generated</DialogTitle>
        <DialogDescription>
          Would you like to navigate to the newly generated component page for details?
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onConfirm}>
          Confirm
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
));

JumpPromptDialog.displayName = 'JumpPromptDialog';

// 主组件
export default function CodeDetailDialog({
  isOpen,
  setShowCodeDetail,
  code,
  showJumpPrompt = false,
  onJumpConfirm,
  onJumpCancel,
}: CodeDetailDialogProps & {
  showJumpPrompt?: boolean;
  onJumpConfirm?: () => void;
  onJumpCancel?: () => void;
}) {
  const files = React.useMemo(() => parseCodeBlock(code), [code]);
  const firstFile = files[0];
  const { language, fileName } = firstFile;

  const markdownContent = React.useMemo(() => files.map(file => {
    if (!file.fileName || file.language === 'text') {
      return file.content;
    }
    return `### ${file.fileName}\n\n\`\`\`${file.language}:${file.fileName}\n${file.content}\n\`\`\``;
  }).join('\n\n'), [files]);

  const handleJumpConfirm = React.useCallback(() => {
    setShowCodeDetail?.(false);
    onJumpConfirm?.();
  },   [ setShowCodeDetail, onJumpConfirm]);

  return (
    <>
      <Dialog open={isOpen}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 overflow-hidden [&>button:last-child]:hidden">
          <div className={cn(
            "rounded-lg overflow-hidden shadow-lg relative",
            "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800",
          )}>
            <MatrixRain />
            <TitleBar
              fileName={fileName}
              language={language}
              onClose={() =>  setShowCodeDetail(false)}
            />
            <CodeContent
              markdownContent={markdownContent}
              language={language}
            />
          </div>
        </DialogContent>
      </Dialog>

      {isOpen && showJumpPrompt && (
        <JumpPromptDialog
          open={showJumpPrompt}
          onCancel={onJumpCancel || (() => {})}
          onConfirm={handleJumpConfirm}
        />
      )}
    </>
  );
}