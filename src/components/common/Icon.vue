<template>
  <svg class="icon">
    <use :xlink:href="formattedIconName"></use>
  </svg>
</template>

<script>
export default {
  name: 'icon',
  props: {
    name: {
      type: String,
      default: '#'
    }
  },
  computed: {
    formattedIconName() {
      return `#${ this.name }`
    }
  }
}
</script>
