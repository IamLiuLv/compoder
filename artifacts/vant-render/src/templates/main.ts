import { createApp } from "vue"
import App from "./App.vue"
import "./style.ts"
import "./constant.ts"
import "./inject-global.ts"
import Vant from "vant"
const app = createApp(App)
app.use(Vant)
app.mount("#app")
