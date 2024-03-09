<template>
  <svg class="icon" :class="classes">
    <use :xlink:href="`#${props.name}`"></use>
  </svg>
</template>

<script setup>
const props = defineProps({
  type: {
    type: String,
    default: 'stroke',
    validator: (value) => value.match(/(fill|stroke)/)
  },
  name: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'middle',
    validator: (value) => value.match(/(large|middle|small)/)
  },
  color: {
    type: String,
    default: 'default',
    validator: (value) => value.match(/(default|primary|secondary|tertiary)/)
  }
})
const classes = {
  [`icon_${props.type}`]: true,
  [`icon_${props.size}`]: true,
  [`icon_color_${props.color}`]: props.color !== 'default'
}

</script>

<style lang="scss" scoped>
.icon {
  display: block;
}

.icon_stroke {
  stroke: $color-text-base;
}

.icon_fill {
  color: $color-text-base;
}

.icon_large {
  width: 24px;
  height: 24px;
}

.icon_middle {
  width: 20px;
  height: 20px;
}

.icon_small {
  width: 16px;
  height: 16px;
}

.icon_color_primary.icon_stroke,
.icon_color_primary.icon_fill {
  color: $color-primary;
}

.icon_color_secondary.icon_stroke,
.icon_color_secondary.icon_fill{
  color: $color-secondary;
}

.icon_color_tertiary.icon_stroke,
.icon_color_tertiary.icon_fill {
  color: $color-tertiary;
}

</style>
