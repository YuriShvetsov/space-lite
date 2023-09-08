<template>
  <Modal class="modal_size_lg" @closed="emit('cancel')" ref="modalRef">
    <template #header>
      <div class="task-editor-header">
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
    <template #default>
      <div
        class="task-editor"
        tabindex="0"
        spellcheck="true"
        data-name="test"
        data-id="test"
      >
        <form class="task-editor__form form">
          <div class="form__body">
            <label class="form__label">
              <div class="form__label-name">Name <span class="">*</span></div>
              <div class="form__input-wrapper">
                <input class="form__input form__input_type_text" type="text" />
              </div>
            </label>
            <MarkdownEditable placeholder="Description" />
          </div>
        </form>

        <Controls
          :preview="isPreviewMode"
          @confirm="confirm"
          @toggle-mode="toggleMode"
        />
      </div>
    </template>
  </Modal>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue'

import {
  delay,
  focusFirstElement,
  catchFocus,
  execWhenShiftEnter
} from '@/utils/helpers'

import Headline from './components/Headline.vue'
import MarkdownEditable from './components/MarkdownEditable.vue'
import MarkdownPreview from './components/MarkdownPreview.vue'
import Controls from './components/Controls.vue'

const emit = defineEmits(['confirm', 'cancel', 'closed'])
const props = defineProps({
  name: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  priority: {
    type: String,
    default: ''
  },
  tags: {
    type: Array,
    default: () => []
  },
  notes: {
    type: Array,
    default: () => []
  },
  edit: {
    type: Boolean,
    default: false
  }
})

const title = computed(() => (props.edit ? 'Edit task' : 'Create a new task'))
const isPreviewMode = ref(false)

// Data

const resultData = reactive({
  name: props.name,
  description: props.description,
  priority: props.priority,
  tags: props.tags,
  notes: props.notes
})

// Modal

const modalRef = ref(null)

// Handlers

const toggleMode = () => {
  isPreviewMode.value = !isPreviewMode.value
}
</script>

<style lang="scss">
@import '@/assets/scss/env';

.task-editor-header {
  width: 100%;
  position: relative;
}

.task-editor-header__close-button {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translate(-50%, -50%);
}

.task-editor {
  display: flex;
  justify-content: stretch;
  flex-direction: column;
  width: 100%;
  max-width: 720px;
  height: 560px;
}

.task-editor__form {
  //flex: 1 0 auto;
  //padding: 16px 16px 20px;
  //background-color: get-light($bgColor, 'main');
}

@include dark-theme {
  .task-editor__form {
    //background-color: get-dark($bgColor, 'main');
  }
}
</style>
