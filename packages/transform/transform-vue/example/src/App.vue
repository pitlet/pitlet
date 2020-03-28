<template>
  <h1>hello world {{ count }}</h1>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'

const useCount = () => {
  const count = ref(0)
  let interval
  onMounted(() => {
    interval = setInterval(() => {
      count.value += 2
    }, 100)
  })
  onUnmounted(() => {
    clearInterval(interval)
  })
  return count
}

export default {
  setup() {
    return {
      count: useCount(),
    }
  },
}
</script>
