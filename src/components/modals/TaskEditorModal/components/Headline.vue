<template>
  <div class="headline">

    <div class="title title_size_l">{{ title }}</div>

    <button
      class="headline__close-button button button_type_icon button_color_black"
      @click="emit('close')"
    >
      <span>Close</span>
      <Icon class="button__icon button__icon_fill" name="close" />
    </button>

  </div>
</template>

<script setup>
const props = defineProps({
  title: String,
  default: ''
})
const emit = defineEmits(['close'])
</script>

<style lang="scss" scoped>
@import '@/assets/scss/env';

.headline {
  width: 100%;
  padding: 16px 20px;
  position: relative;
  background-color: get-light($bgColor, 'main');
  border-radius: 8px 8px 0 0;
  border-top: 1px solid get-light($sectionBorderColor);
  border-right: 1px solid get-light($sectionBorderColor);
  border-bottom: 1px solid get-light($sectionBorderColor);
  border-left: 1px solid get-light($sectionBorderColor);
}

.headline__close-button {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>
