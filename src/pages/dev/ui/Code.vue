<template>
  <highlightjs
    class="code"
    :language="props.language"
    :code="formattedCode"
  />
</template>

<script setup>
const props = defineProps({
  code: {
    type: [String, Object],
    default: '{}',
    validator: (value) => (typeof(value)).match(/(string|object)/)
  },
  language: {
    type: String,
    default: 'json'
  }
})
const formattedCode = (() => {
  if (typeof props.code === 'object') {
    return JSON.stringify(props.code, null, 2)
  }

  return props.code
})()
</script>

<style lang="scss">
pre code.hljs {
  padding: 0 !important;
  overflow-y: hidden;

  font-family: $font-mono, monospace;
  line-height: 1.2em;
  background-color: transparent !important;
}
</style>
