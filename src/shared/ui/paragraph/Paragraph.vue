<template>
  <component :is="type" class="paragraph" :class="classes">
    <slot />
  </component>
</template>

<script setup>
const props = defineProps({
  type: {
    type: String,
    default: 'p',
    validator: (value) => value.match(/(p|span)/)
  },
  isHeavy: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: 'middle',
    validator: (value) => value.match(/(large|middle|small)/)
  }
})
const classes = {
  paragraph_heavy: props.isHeavy,
  [`paragraph_${props.size}`]: true
}
</script>

<style lang="scss" scoped>
.paragraph {
  font-weight: normal;
}

.paragraph_heavy {
  font-weight: 800;
}

.paragraph_large {
  font-size: 16px;
}

.paragraph_middle {
  font-size: 14px;
}

.paragraph_small {
  font-size: 13px;
}
</style>
