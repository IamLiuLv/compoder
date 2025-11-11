import { createApp, defineComponent, h } from "vue/dist/vue.esm-bundler.js"

import * as Vue from "vue/dist/vue.esm-bundler.js"
import * as Antdv from "ant-design-vue"
import * as AntdvIcons from "@ant-design/icons-vue"
import * as dayjs from "dayjs"
import ErrorDisplay from "./components/ErrorDisplay.vue"

const mockModules: Record<string, any> = {
  vue: Vue,
  "ant-design-vue": Antdv,
  "@ant-design/icons-vue": AntdvIcons,
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

  // 匹配不同顺序的script setup标签
  const scriptSetupMatch =
    componentString.match(
      /<script\s+setup\s+lang=["']ts["']>([\s\S]*)<\/script>/,
    ) ||
    componentString.match(
      /<script\s+lang=["']ts["']\s+setup>([\s\S]*)<\/script>/,
    ) ||
    componentString.match(/<script\s+setup>([\s\S]*)<\/script>/)

  // 匹配普通script标签
  const scriptMatch =
    componentString.match(/<script\s+lang=["']ts["']>([\s\S]*)<\/script>/) ||
    componentString.match(/<script>([\s\S]*)<\/script>/)

  // 匹配style标签
  const styleMatch =
    componentString.match(/<style\s+scoped>([\s\S]*)<\/style>/) ||
    componentString.match(/<style>([\s\S]*)<\/style>/)

  const template = templateMatch ? templateMatch[1].trim() : ""
  const style = styleMatch ? styleMatch[1].trim() : ""

  // 检测是否使用setup语法
  const isSetup = !!scriptSetupMatch
  const scriptContent = isSetup
    ? scriptSetupMatch[1].trim()
    : scriptMatch
    ? scriptMatch[1].trim()
    : "export default {}"

  console.log("Script content:", scriptContent)
  console.log("Is setup:", isSetup)

  // 提取导入语句和变量声明
  const imports: Record<string, string[]> = {}
  let processedScript = scriptContent.replace(
    /import\s+(\{[^}]+\}|\w+)\s+from\s+['"]([^'"]+)['"]/g,
    (match, importNames, moduleName) => {
      console.log("Import match:", match, importNames, moduleName)
      imports[moduleName] = importNames
        .replace(/[{}]/g, "")
        .split(",")
        .map((name: string) => name.trim())
      return ""
    },
  )

  console.log("Processed script:", processedScript)
  console.log("Imports:", imports)

  try {
    // 准备模拟导入
    const mockImports = Object.entries(imports).reduce(
      (acc: Record<string, any>, [moduleName, importNames]) => {
        const moduleExports = mockModules[moduleName] || {}
        console.log("Module exports for", moduleName, ":", moduleExports)
        importNames.forEach(name => {
          if (name === "default") {
            acc[moduleName] = moduleExports
          } else {
            acc[name] = moduleExports[name]
            console.log("Imported", name, ":", moduleExports[name])
          }
        })
        return acc
      },
      {},
    )

    console.log("Mock imports:", mockImports)

    let componentOptions: any = {}

    if (isSetup) {
      // 处理<script setup>语法
      // 1. 提取变量和函数声明
      const setupVars: string[] = []
      const setupContent = processedScript

      // 提取变量声明 (const, let, var)
      const varRegex = /(const|let|var)\s+(\w+)\s*=/g
      let match
      while ((match = varRegex.exec(setupContent)) !== null) {
        setupVars.push(match[2])
      }

      // 提取函数声明
      const funcRegex = /function\s+(\w+)/g
      while ((match = funcRegex.exec(setupContent)) !== null) {
        setupVars.push(match[1])
      }

      // 提取箭头函数
      const arrowFuncRegex = /const\s+(\w+)\s*=\s*(\([^)]*\)|[^=]*)\s*=>/g
      while ((match = arrowFuncRegex.exec(setupContent)) !== null) {
        setupVars.push(match[1])
      }

      console.log("Setup variables:", setupVars)

      // 2. 创建setup函数
      const setupFunction = new Function(
        ...Object.keys(mockImports),
        `
        try {
          ${setupContent}
          return { ${[...setupVars, ...Object.keys(mockImports)].join(", ")} }
        } catch (error) {
          console.error("Error in setup function:", error)
          return {}
        }
        `,
      )

      // 3. 创建组件选项
      componentOptions = {
        setup() {
          try {
            const setupResult = setupFunction(...Object.values(mockImports))
            console.log("Setup result:", setupResult)
            return setupResult
          } catch (error) {
            console.error("Error executing setup function:", error)
            return {}
          }
        },
      }
    } else {
      // 处理传统的export default语法
      processedScript = processedScript.replace(
        /export\s+default\s*(\{[\s\S]*\}|[^{;\n]+)/,
        (match, exportedContent) => `return ${exportedContent}`,
      )

      const scriptFunction = new Function(
        ...Object.keys(mockImports),
        `
        try {
          ${processedScript}
        } catch (error) {
          console.error("Error in component options:", error)
          return {}
        }
        `,
      )

      componentOptions = scriptFunction(...Object.values(mockImports))
    }

    console.log("Component options:", componentOptions)

    // 使用defineComponent创建组件
    const component = defineComponent({
      ...componentOptions,
      template,
    })

    console.log("Defined component:", component)

    // 渲染组件
    const renderComponent = () => {
      try {
        const container = document.getElementById("artifacts-container")
        if (container) {
          container.innerHTML = ""

          // 创建应用实例
          const app = createApp(component)

          // 注册Antdv
          app.use(Antdv)

          // 注册所有图标组件
          for (const [key, iconComponent] of Object.entries(AntdvIcons)) {
            if (typeof iconComponent === "object" && iconComponent !== null) {
              app.component(key, iconComponent)
            }
          }

          // 挂载应用
          app.mount(container)

          setTimeout(() => {
            handleSuccess()
          }, 100)
        }
      } catch (error) {
        console.error("Error rendering component:", error)
        handleError(`Error rendering component: ${error}`)

        const app = createApp({
          render() {
            return h(ErrorDisplay, {
              errorMessage: `Error rendering component: ${error}`,
            })
          },
        })

        const container = document.getElementById("artifacts-container")
        if (container) {
          container.innerHTML = ""
          app.mount(container)
        }
      }
    }

    // 处理样式
    if (style) {
      const existingStyle = document.querySelector("[data-artifacts-style]")
      if (existingStyle) {
        document.head.removeChild(existingStyle)
      }

      const styleElement = document.createElement("style")
      styleElement.textContent = style
      styleElement.setAttribute("data-artifacts-style", "true")
      document.head.appendChild(styleElement)
    }

    // 渲染组件
    renderComponent()
    return true
  } catch (error) {
    console.error("Error creating component:", error)
    handleError(`Error creating component: ${error}`)

    const app = createApp({
      render() {
        return h(ErrorDisplay, {
          errorMessage: `Error creating component: ${error}`,
        })
      },
    })

    const container = document.getElementById("artifacts-container")
    if (container) {
      container.innerHTML = ""
      app.mount(container)
    }

    return null
  }
}
