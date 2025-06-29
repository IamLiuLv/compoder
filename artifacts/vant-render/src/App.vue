<template>
  <div class="repl-container">
    <Sandbox :store="store" ref="replRef" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import { Repl, useStore, Sandbox } from "@vue/repl"
import { defaultSrcFiles, importsMap, mainFile } from "./helper"

const key = ref(0)
const replRef = ref<InstanceType<typeof Repl>>()

const store = useStore({
  builtinImportMap: ref(importsMap),
})

const handleMessage = (event: any) => {
  const { type, data } = event.data
  if (type === "artifacts") {
    console.log("artifacts", data.files)
    setTimeout(() => {
      store.setFiles(Object.assign(defaultSrcFiles, data.files), mainFile)
      key.value += 1 // Update the key to force remount
    }, 1000)
  }
}

onMounted(() => {
  window.addEventListener("message", handleMessage)
  window.parent.postMessage("IFRAME_LOADED", "*")

  store.setFiles(defaultSrcFiles, mainFile)

  // 创建 MutationObserver 实例来监听 DOM 变化
  const observer = new MutationObserver(mutations => {
    // 检查是否有错误消息元素
    const errorNodes = document.querySelectorAll(".msg.err")
    if (errorNodes.length > 0) {
      // 获取错误信息
      const errorMessages = Array.from(errorNodes)
        .map(node => node.textContent)
        .join("\n")
      // 通知父窗口错误信息
      window.parent.postMessage(
        {
          type: "artifacts-error",
          errorMessage: errorMessages,
        },
        "*",
      )
    }
  })

  // 配置观察选项
  const config = { childList: true, subtree: true }
  // 开始观察整个文档
  observer.observe(document.body, config)
})
</script>

<style scoped lang="less">
.repl-container {
  height: 100vh;
  width: 100vw;
}
</style>
