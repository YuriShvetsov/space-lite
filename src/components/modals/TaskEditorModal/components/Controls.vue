<template>
  <div class="controls">
    <div class="controls__col">
      <button
        v-show="false"
        class="task-editor__delete-button button button_type_icon-text button_color_red"
      >
        <span>Delete</span>
        <Icon class="button__icon button__icon_stroke" name="delete" />
      </button>
    </div>

    <div class="controls__col">
      <button
        class="form__control-button button button_type_icon-text button_color_black"
        @click="emit('toggle-mode')"
      >
        <span>{{ modeBtnText }}</span>
        <Icon
          class="button__icon"
          :class="modeBtnClasses"
          :name="modeBtnIcon"
        />
      </button>
      <button
        class="form__control-button form__control-button_violet button button_fill_violet"
      >
        Create Task
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const emit = defineEmits(['toggle-mode'])
const props = defineProps({
  preview: {
    type: Boolean,
    default: false
  }
})

const modeBtnText = computed(() => (props.preview ? 'Preview' : 'Markdown'))
const modeBtnIcon = computed(() => (props.preview ? 'eye' : 'code'))
const modeBtnClasses = computed(() =>
  props.preview ? 'button__icon_fill' : 'button__icon_stroke'
)
</script>

<style lang="scss" scoped>
@import '@/assets/scss/env/index';

.controls {
  display: flex;
  justify-content: space-between;
  padding: 16px 20px;
  background-color: get-light($bgColor, 'main');
  border-right: 1px solid get-light($sectionBorderColor);
  border-top: 1px solid get-light($sectionBorderColor);
  border-left: 1px solid get-light($sectionBorderColor);
  border-radius: 0 0 8px 8px;
}

.controls__col {
  display: flex;
  gap: 12px;
}
</style>
