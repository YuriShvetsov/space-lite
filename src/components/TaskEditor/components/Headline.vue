<template>
  <div class="task-editor__headline">

    <div class="task-editor__title title title_size_l">{{ title }}</div>

    <button
      class="task-editor__close-button button button_type_icon button_color_black"
      @click="emit('close')"
    >
      <span>Close</span>
      <svg class="button__icon button__icon_fill">
        <use xlink:href="#close"></use>
      </svg>
    </button>

  </div>
</template>

<script setup>
const props = defineProps({
  title: String
})
const emit = defineEmits(['close'])
</script>

<style lang="scss" src="./headline.scss"></style>
