<template>
  <div id="artifacts-container"></div>
</template>

<script>
import { ref, onMounted, onUnmounted } from "vue"
import { createComponentFromString } from "./utils"

export default {
  name: "ElementUIPlusRenderer",
  setup() {
    const codeContent = ref("")
    const key = ref(0)

    const handleSuccess = () => {
      window.parent.postMessage(
        {
          type: "artifacts-success",
        },
        "*",
      )
    }

    const handleMessage = event => {
      const { type, data } = event.data
      if (type === "artifacts") {
        codeContent.value = data.files[data.entryFile]
        createComponentFromString(codeContent.value)
        key.value += 1 // Update the key to force remount
      }
    }

    onMounted(() => {
      window.addEventListener("message", handleMessage)
      window.parent.postMessage("IFRAME_LOADED", "*")
    })

    onUnmounted(() => {
      window.removeEventListener("message", handleMessage)
    })

    return {
      codeContent,
      key,
    }
  },
}
</script>
