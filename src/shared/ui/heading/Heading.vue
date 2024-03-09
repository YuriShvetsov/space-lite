<template>
  <component :is="tag" class="heading" :class="classes">
    <slot />
  </component>
</template>

<script setup>
const props = defineProps({
  level: {
    type: String,
    default: 'h1',
    validator: (value) => value.match(/(h0|h1|h2|h3|h4|h5|h6)/)
  }
})
const tag = (() => {
  if (props.level === 'h0') return 'h1'

  return props.level
})()
const classes = {
  heading_h0: props.level === 'h0'
}
</script>

<style lang="scss" scoped>
.heading {
  font-weight: bold;
  color: $color-text-base;
}

h1 {
  font-size: 36px;
}

h2 {
  font-size: 30px;
}

h3 {
  font-size: 24px;
}

h4 {
  font-size: 22px;
}

h5 {
  font-size: 20px;
}

h6 {
  font-size: 18px;
}

.heading_h0 {
  font-size: 48px;
}
</style>
