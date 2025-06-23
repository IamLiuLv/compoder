/// <reference types="vite/client" />
declare module "*.vue" {
  import { DefineComponent } from "vue"
  const component: DefineComponent<{}, {}, any>
  export default component
}
declare module "vue/dist/vue.esm-bundler.js" {
  export * from "vue"
}
