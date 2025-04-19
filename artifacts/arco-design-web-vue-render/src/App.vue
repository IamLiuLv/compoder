<template>
  <div class="repl-container">
    <Sandbox :store="store" ref="replRef" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Repl, useStore, Sandbox } from "@vue/repl";
import { defaultSrcFiles, importsMap, mainFile } from "./helper";

const key = ref(0);
const replRef = ref<InstanceType<typeof Repl>>();


const store = useStore({
  builtinImportMap: ref(importsMap),
})


const handleSuccess = () => {
  window.parent.postMessage(
    {
      type: "artifacts-success",
    },
    "*"
  );
};

const handleMessage = (event: any) => {
  const { type, data } = event.data;
  if (type === "artifacts") {
    store.setFiles(Object.assign(defaultSrcFiles, data.files), mainFile)

    key.value += 1; // Update the key to force remount
  }
};


onMounted(() => {
  window.addEventListener("message", handleMessage);
  window.parent.postMessage("IFRAME_LOADED", "*");
});


</script>

<style scoped lang="less">
.repl-container {
  height: 100vh;
  width: 100vw;
}
</style>