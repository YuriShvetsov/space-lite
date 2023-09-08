<template>
  <div class="markdown-editable form__label" ref="wrapperRef" @click="focus">
    <div v-if="placeholder" class="form__label-name">
      {{ placeholder }}
    </div>
    <div class="form__input-wrapper">
      <Codemirror
        class="markdown-editable__codemirror"
        ref="codemirrorRef"
        v-model="code"
        :tab-size="2"
        :extensions="extensions"
        @ready="handleReady"
        @focus="handleFocus"
        @blur="handleBlur"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, shallowRef } from 'vue'
import { Codemirror } from 'vue-codemirror'
import { markdown } from '@codemirror/lang-markdown'
import { basicLight } from 'cm6-theme-basic-light'
import { oneDark } from '@codemirror/theme-one-dark'

console.log(markdown)

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  }
})

const extensions = [markdown(), basicLight]
const wrapperRef = ref(null)

// State

const isFocused = ref(false)
const code = ref(
  '### Title 000\n' + '\n' + '```\n' + 'zsh\n' + 'npm run build\n' + '```'
)

const view = shallowRef()
const focus = () => {
  const codemirrorInput = wrapperRef.value.querySelector('.cm-content')
  codemirrorInput.focus()
}
const handleReady = (payload) => {
  console.log(payload)
  view.value = payload.view
}
const handleFocus = () => (isFocused.value = true)
const handleBlur = () => (isFocused.value = false)
</script>

<style lang="scss" scoped>
@import '@/assets/scss/env';

.markdown-editable {
  position: relative;
}

.markdown-editable__placeholder {
  font-size: 13px;
  color: #5a5a5a;
}

.markdown-editable__codemirror::v-deep .cm-editor {
  height: 360px;
  padding: 0 8px;
  line-height: 1em;

  border: 1px solid #e2e1de;
  outline: 0 solid lighten($primaryColor, 32%);
  border-radius: 6px;

  cursor: text;
  transition:
    background-color 0.15s ease-in-out,
    border 0.15s ease-in-out,
    outline 0.15s ease-in-out;

  &.cm-focused {
    background-color: lighten($primaryColor, 36%);
    border: 1px solid $primaryColor;
    outline: 2px solid lighten($primaryColor, 32%);
  }

  .cm-content {
    padding: 8px 0;
    font-family: 'Hack', monospace;
    font-size: 13px;
  }

  .cm-line {
    padding: 0;
  }

  .cm-line.cm-activeLine {
    background: transparent;
  }

  .cm-gutters {
    display: none;
  }
}
</style>
