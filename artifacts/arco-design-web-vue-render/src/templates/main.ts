import { createApp } from "vue"
import App from "./App.vue"
import ArcoVue from "@arco-design/web-vue"
import ArcoVueIcon from "@arco-design/web-vue/es/icon"
import { createPinia } from "pinia"

import "./style.ts"
import "./constant.ts"
import "./inject-global.ts"

console.log("inject global attributes 123: ", window.Vue, ArcoVue, ArcoVueIcon)

window.__ARCO_VUE__ = ArcoVue
window.__ARCO_VUE_ICON__ = ArcoVueIcon

const store = createPinia()

const app = createApp(App)
app.use(store)
app.use(ArcoVue)
app.use(ArcoVueIcon)
app.mount("#app")
