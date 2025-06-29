import welcomeCode from "./templates/welcome.vue?raw"
import mainCode from "./templates/main.ts?raw"
import constantCode from "./templates/constant.ts?raw"
import injectGlobalCode from "./templates/inject-global.ts?raw"
import styleCode from "./templates/style.ts?raw"

export const CURRENT_ORIGIN = window.location.origin || ""

// 动态导入 npm-packages.json
// @ts-ignore
import npmConfig from "../npm-packages.json"

// 生成 importsMap
export const importsMap = {
  imports: Object.fromEntries(
    npmConfig.packages.map(pkg => [
      pkg.name,
      `${CURRENT_ORIGIN}/npm/${pkg.path}`,
    ]),
  ),
  scopes: {},
}

const files: Record<string, string> = {
  "src/main.ts": mainCode,
  "src/App.vue": welcomeCode,
  "constant.ts": constantCode,
  "inject-global.ts": injectGlobalCode,
  "style.ts": styleCode,
}

export const mainFile = "src/main.ts"

export const defaultSrcFiles = Object.keys(files)
  .map(key => ({
    [key]: (files[key] || "").replace(/#CURRENT_ORIGIN#/g, CURRENT_ORIGIN),
  }))
  .reduce((a, b) => ({ ...a, ...b }), {})

/**
 * 将字符串转换为base64编码
 * @param data 需要编码的字符串
 * @returns base64编码后的字符串
 * @description 该函数首先使用encodeURIComponent对字符串进行URL编码，
 * 然后使用unescape解码为原始字符串，最后使用btoa转换为base64编码
 */
export function utoa(data: string): string {
  return btoa(unescape(encodeURIComponent(data)))
}

/**
 * 将base64编码转换回原始字符串
 * @param base64 base64编码的字符串
 * @returns 解码后的原始字符串
 * @description 该函数是utoa的逆操作，首先使用atob解码base64字符串，
 * 然后使用escape进行编码，最后使用decodeURIComponent解码为原始字符串
 */
export function atou(base64: string): string {
  return decodeURIComponent(escape(atob(base64)))
}
