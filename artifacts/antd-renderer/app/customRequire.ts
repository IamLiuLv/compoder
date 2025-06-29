export const customRequire = (moduleName: string) => {
  const modules: { [key: string]: any } = {
    // base modules
    react: require("react"),
    "react-dom": require("react-dom"),
    antd: require("antd"),
    "@ant-design/icons": require("@ant-design/icons"),
    "@ant-design/pro-components": require("@ant-design/pro-components"),
    "@ant-design/use-emotion-css": require("@ant-design/use-emotion-css"),
    "styled-components": require("styled-components"),
  }

  if (modules[moduleName]) {
    return modules[moduleName]
  }

  throw new Error(`Module ${moduleName} not found`)
}
