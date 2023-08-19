<template>
  <div class="task-editor__controls">

    <div class="task-editor__controls-col">
      <button
        v-if="isActiveMode('edit')"
        class="task-editor__delete-button button button_type_icon-text button_color_red"
      >
        <span>Delete</span>
        <svg class="button__icon button__icon_stroke">
          <use xlink:href="#delete"></use>
        </svg>
      </button>
    </div>

    <div class="task-editor__controls-col">
      <button
        class="task-editor__desc-mode-button button button_type_icon-text button_color_black"
        @click="toggleMarkdownSwitcher"
      >
        <span>{{ options.markdownSwitcher.text }}</span>
        <svg
          class="button__icon"
          :class="options.markdownSwitcher.icon.class"
        >
          <use :xlink:href="options.markdownSwitcher.icon.id"></use>
        </svg>
      </button>
      <button
        class="button button_fill_violet"
        @click="emit('confirm')"
      >{{ options.successButtonText }}</button>
    </div>

  </div>
</template>

<script setup>
import { reactive, computed } from 'vue'
import { MARKDOWN_SWITCHER_OPTIONS_BY_STATE, SUCCESS_BUTTON_TEXT_BY_MODE } from '../static'

const props = defineProps({
  mode: {
    type: String,
    validator: (value) => ['add', 'edit'].includes(value)
  }
})
const emit = defineEmits(['change:markdown-state', 'confirm'])

// Data

const data = reactive({
  markdownSwitcherState: 'edit'
})
const options = computed(() => ({
  get successButtonText() {
    return SUCCESS_BUTTON_TEXT_BY_MODE[props.mode]
  },
  get markdownSwitcher() {
    return MARKDOWN_SWITCHER_OPTIONS_BY_STATE[data.markdownSwitcherState]
  }
}))

// Methods

const isActiveMode = (value) => value === props.mode
const toggleMarkdownSwitcher = () => {
  if (data.markdownSwitcherState === 'edit') {
    data.markdownSwitcherState = 'preview'
  } else {
    data.markdownSwitcherState = 'edit'
  }

  emit('change:markdown-state', data.markdownSwitcherState)
}

// Hooks



</script>

<style lang="scss" src="./control-bar.scss"></style>
