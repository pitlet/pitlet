<template>
  <h1>{{ message }}</h1>
</template>

<script>
export default {
  setup() {
    const message = ref('hello world')
    return {
      message,
    }
  },
}
</script>
