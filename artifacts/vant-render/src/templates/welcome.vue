<script setup>
import { ref, reactive } from "vue"
import { tryOnMounted } from "@vueuse/core"
const msg = ref("Hello World")
tryOnMounted(() => {
  console.log("mounted")
})
</script>

<template>
  <div class="flex justify-center items-center h-screen">
    <van-loading color="#1989fa" />
  </div>
</template>
