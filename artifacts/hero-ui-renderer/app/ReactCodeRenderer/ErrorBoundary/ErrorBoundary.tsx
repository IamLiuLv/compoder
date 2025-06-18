import { Component, ErrorInfo } from "react"
import { ErrorDisplay } from "../ErrorDisplay"
import { ErrorBoundaryProps, ErrorBoundaryState } from "./interface"

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      errorMessage: null,
    }
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // 增强错误信息 - 检测未定义组件错误
    const enhancedErrorMessage = this.processErrorMessage(error, errorInfo)

    this.setState({ errorMessage: enhancedErrorMessage, errorInfo })
    this.props.onError(enhancedErrorMessage)
  }

  // 处理错误信息，提供更有意义的反馈
  processErrorMessage(error: Error, errorInfo: ErrorInfo): string {
    // 检测React典型的未定义组件错误
    const undefinedComponentMatch = error.message.match(
      /type is invalid.*?but got: undefined.*?You likely forgot to export/i,
    )

    if (undefinedComponentMatch) {
      // 从错误堆栈中提取组件名称
      let componentName = "Unknown"
      let importSource = "unknown module"

      // 尝试从错误堆栈中获取有用的信息
      if (errorInfo.componentStack) {
        // 提取组件名称 - 通常是第一行包含的信息
        const componentMatch = errorInfo.componentStack.match(
          /\s+at\s+([A-Za-z0-9_]+)/,
        )
        if (componentMatch && componentMatch[1]) {
          componentName = componentMatch[1]
        }

        // 尝试提取可能的导入源
        const lines = error.stack?.split("\n") || []
        for (const line of lines) {
          const moduleMatch = line.match(/from ['"]([^'"]+)['"]/)
          if (moduleMatch) {
            importSource = moduleMatch[1]
            break
          }
        }
      }

      return `Component error: The component "${componentName}" being rendered is undefined. This likely happens when:
1. You're importing a component that doesn't exist in "${importSource}"
2. You've misspelled the component name during import or usage
3. The component exists but wasn't properly exported

Check your imports and component usage.`
    }

    return error.message
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    // Reset error state when files prop changes to allow retry
    if (this.state.hasError && this.props.files !== prevProps.files) {
      this.setState({
        hasError: false,
        errorMessage: null,
        errorInfo: null,
      })
    }
  }

  render() {
    if (this.state.hasError) {
      return <ErrorDisplay errorMessage={this.state.errorMessage} />
    }

    return this.props.children
  }
}

export default ErrorBoundary
