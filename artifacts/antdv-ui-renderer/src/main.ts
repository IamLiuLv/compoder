import { createApp } from "vue"
import "./style.css"
import App from "./App.vue"
import "ant-design-vue/dist/reset.css"

import Antdv from "ant-design-vue"
import * as AntdvIconsVue from "@ant-design/icons-vue"

const app = createApp(App)
app.use(Antdv)

for (const [key, component] of Object.entries(AntdvIconsVue)) {
  app.component(key, component)
}

app.mount("#app")
