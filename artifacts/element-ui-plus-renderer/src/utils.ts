import { createApp, defineComponent, h } from "vue/dist/vue.esm-bundler.js"

import * as Vue from "vue/dist/vue.esm-bundler.js"
import * as ElementPlus from "element-plus"
import * as ElementIcons from "@element-plus/icons-vue"
import * as dayjs from "dayjs"
import ErrorDisplay from "./components/ErrorDisplay.vue"

const mockModules: Record<string, any> = {
  vue: Vue,
  "element-plus": ElementPlus,
  "@element-plus/icons-vue": ElementIcons,
  dayjs: dayjs,
}

// 添加错误处理和成功处理函数
const handleError = (errorMessage: string) => {
  window.parent.postMessage(
    {
      type: "artifacts-error",
      errorMessage,
    },
    "*",
  )
}

const handleSuccess = () => {
  window.parent.postMessage(
    {
      type: "artifacts-success",
    },
    "*",
  )
}

export function createComponentFromString(componentString: string) {
  const templateMatch = componentString.match(/<template>([\s\S]*)<\/template>/)
  const scriptMatch = componentString.match(/<script>([\s\S]*)<\/script>/)
  const styleMatch = componentString.match(/<style scoped>([\s\S]*)<\/style>/)

  const template = templateMatch ? templateMatch[1].trim() : ""
  let scriptContent = scriptMatch
    ? scriptMatch[1].trim()
    : "exports.default = {}"
  const style = styleMatch ? styleMatch[1].trim() : ""

  const imports: Record<string, string[]> = {}
  // 提取所有的导入语句
  scriptContent = scriptContent.replace(
    /import\s+(\{[^}]+\}|\w+)\s+from\s+['"]([^'"]+)['"]/g,
    (match, importNames, moduleName) => {
      imports[moduleName] = importNames
        .replace(/[{}]/g, "")
        .split(",")
        .map((name: string) => name.trim())
      return ""
    },
  )

  // 将 export default 转换为 exports.default =
  scriptContent = scriptContent.replace(
    /export\s+default\s*(\{[\s\S]*\}|[^{;\n]+)/,
    (match, exportedContent) => `exports.default = ${exportedContent}`,
  )

  let componentOptions = {}
  try {
    const mockImports = Object.entries(imports).reduce(
      (acc: Record<string, any>, [moduleName, importNames]) => {
        const moduleExports = mockModules[moduleName] || {}
        importNames.forEach(name => {
          if (name === "default") {
            acc[moduleName] = moduleExports
          } else {
            acc[name] = moduleExports[name]
          }
        })
        return acc
      },
      {},
    )

    const scriptFunction = new Function(
      ...Object.keys(mockImports),
      `
      const exports = {};
      ${scriptContent}
      return exports.default || {};
    `,
    )
    componentOptions = scriptFunction(...Object.values(mockImports))
  } catch (error) {
    console.error("Error parsing script:", error)
    const errorMessage = `Error parsing script: ${error}`
    handleError(errorMessage)
    const app = createApp({
      render() {
        return h(ErrorDisplay, { errorMessage })
      },
    })
    const container = document.getElementById("artifacts-container")
    if (container) {
      container.innerHTML = ""
      app.mount(container)
    }
    return null
  }

  console.log("componentOptions", componentOptions)

  // 使用 defineComponent 来创建组件
  const component = defineComponent({
    ...componentOptions,
    template: template,
  })

  // 创建一个渲染函数
  const renderComponent = () => {
    try {
      // 清空容器内容
      const container = document.getElementById("artifacts-container")
      if (container) {
        container.innerHTML = ""
      }

      // 创建新的应用实例
      const app = createApp(component)

      // 注册Element Plus
      app.use(ElementPlus)

      // 注册图标组件
      for (const [key, iconComponent] of Object.entries(ElementIcons)) {
        app.component(key, iconComponent)
      }

      if (container) {
        app.mount(container)
        // 延迟一下再发送成功消息，确保渲染完成
        setTimeout(() => {
          handleSuccess()
        }, 100)
      }
      return null
    } catch (error) {
      console.error("Error rendering component:", error)
      const errorMessage = `Error rendering component: ${error}`
      handleError(errorMessage)
      const app = createApp({
        render() {
          return h(ErrorDisplay, { errorMessage })
        },
      })
      const container = document.getElementById("artifacts-container")
      if (container) {
        container.innerHTML = ""
        app.mount(container)
      }
    }
  }

  if (style) {
    // 先移除已有的 artifacts-style 标签
    const existingStyle = document.querySelector("[data-artifacts-style]")
    if (existingStyle) {
      document.head.removeChild(existingStyle)
    }
    const styleElement = document.createElement("style")
    styleElement.textContent = style
    // 添加特殊的属性，用于标识是 artifacts 的 style
    styleElement.setAttribute("data-artifacts-style", "true")
    document.head.appendChild(styleElement)
  }

  renderComponent()
}
