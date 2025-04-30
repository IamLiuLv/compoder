import welcomeCode from "./templates/welcome.vue?raw"
import mainCode from "./templates/main.ts?raw"
import constantCode from "./templates/constant.ts?raw"
import injectGlobalCode from "./templates/inject-global.ts?raw"
import styleCode from "./templates/style.ts?raw"

export const CURRENT_ORIGIN = window.location.origin || ""

// 导入所需的 import map 资源
// 以下所有的资源都从 https://www.jsdelivr.com 域名获取，为了保证资源的加载速度和稳定性故而放在public目录下
export const importsMap = {
  imports: {
    vue: `${CURRENT_ORIGIN}/npm/@vue/runtime-dom@3.2.0/dist/runtime-dom.esm-browser.js`,
    "vue/server-renderer": `${CURRENT_ORIGIN}/npm/@vue/shared@3.2.0/dist/shared.esm-bundler.js`,
    "vue-i18n": `${CURRENT_ORIGIN}/npm/vue-i18n@9.2.0-beta.36/dist/vue-i18n.esm-browser.js`,
    // "vue-router": `${CURRENT_ORIGIN}/npm/vue-router@4.0.16/dist/vue-router.esm-browser.js`,

    birpc: `${CURRENT_ORIGIN}/npm/birpc@2.3.0/dist/index.mjs`,
    hookable: `${CURRENT_ORIGIN}/npm/hookable@5.5.3/dist/index.mjs`,
    "perfect-debounce": `${CURRENT_ORIGIN}/npm/perfect-debounce@1.0.0/dist/index.mjs`,
    "@vue/devtools-shared": `${CURRENT_ORIGIN}/npm/@vue/devtools-shared@7.7.2/dist/index.min.js`,
    "@vue/devtools-kit": `${CURRENT_ORIGIN}/npm/@vue/devtools-kit@7.7.2/dist/index.min.js`,
    "@vue/devtools-api": `${CURRENT_ORIGIN}/npm/@vue/devtools-api@7.7.2/dist/index.js`,

    // "@vue/devtools-api": 'https://cdn.jsdelivr.net/npm/@vue/devtools-api@7.7.2/+esm',

    "@vueuse/core": `${CURRENT_ORIGIN}/npm/@vueuse/core@9.6.0/index.mjs`,
    "@vueuse/shared": `${CURRENT_ORIGIN}/npm/@vueuse/shared@9.6.0/index.mjs`,
    axios: `${CURRENT_ORIGIN}/npm/axios@1.0.0/dist/esm/axios.js`,
    "axios-mock-adapter": `${CURRENT_ORIGIN}/npm/axios-mock-adapter@1.21.1/dist/axios-mock-adapter.js`,

    "vue-demi": `${CURRENT_ORIGIN}/npm/vue-demi@0.13.11/lib/index.mjs`,
    pinia: `${CURRENT_ORIGIN}/npm/pinia@2.0.22/dist/pinia.esm-browser.js`,

    // "@arco-design/web-vue": `https://cdn.jsdelivr.net/npm/@arco-design/web-vue@2.57.0/+esm`,
    "@arco-design/web-vue": `${CURRENT_ORIGIN}/npm/arco-design-web-vue-mjs@0.0.1/dist/arco-vue.mjs`,
    "@arco-design/web-vue/es/icon": `${CURRENT_ORIGIN}/npm/arco-design-web-vue-mjs@0.0.1/dist/arco-vue-icon.mjs`,
  },
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
