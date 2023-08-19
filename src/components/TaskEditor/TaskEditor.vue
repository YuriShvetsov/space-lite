<template>
  <modal class="modal_size_lg" ref="modalElement">
    <div class="task-editor">

      <headline :title="options.title" @close="close" />

      <form
        v-show="isMarkdownEditorVisible"
        class="task-editor__form" @submit.prevent ref="formElement"
      >

        <div class="form__row form__row_input">
          <label class="form__label">
            <span class="form__label-name">Name <span class="form__required-sign">*</span></span>
            <input
              class="task-editor__field form__input form__input_type_text"
              type="text"
              name="name"
              spellcheck="false"
              autocomplete="off"
              important
              v-model="todo.name"
            >
          </label>
        </div>

        <div class="form__row form__row_input">
          <label class="form__label">
            <span class="form__label-name">Description</span>
            <markdown-editor v-show="isMarkdownEditorVisible" v-model="todo.notes" />
          </label>
        </div>

      </form>

      <div
        v-show="!isMarkdownEditorVisible"
        class="task-editor__preview"
      >
        <div>{{ todo.name }}</div>
        <markdown-previewer />
      </div>

      <control-bar
        :mode="props.mode"
        @change:markdown-state="onChangeMarkdownState"
        @confirm="onConfirm"
      />

    </div>
  </modal>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'

import Headline from './components/Headline.vue'
import MarkdownEditor from './components/MarkdownEditor.vue'
import MarkdownPreviewer from './components/MarkdownPreviewer.vue'
import ControlBar from './components/ControlBar.vue'

import { MODAL_TITLES_BY_MODE } from './static'

const props = defineProps({
  mode: {
    type: String,
    validator: (value) => ['add', 'edit'].includes(value)
  },
  todo: {
    type: Object,
    default: null
  }
})
const emit = defineEmits(['cancel', 'confirm'])
const options = computed(() => {
  return {
    get title() {
      return MODAL_TITLES_BY_MODE[props.mode]
    }
  }
})
const isMarkdownEditorVisible = ref(true)
const todo = reactive({
  name: props.todo?.name || '',
  notes: props.todo?.notes || ''
})

// Modal window

const modalElement = ref(null)

// Form

const formElement = ref(null)

// Methods

const isActiveMode = (mode) => mode === props.mode
const onChangeMarkdownState = (mode) => {
  isMarkdownEditorVisible.value = !isMarkdownEditorVisible.value
}
const onConfirm = () => {
  emit('confirm', data)
}

onMounted(() => {
  modalElement.value.open()
})

defineExpose({
  open,
  close
})

</script>

<style lang="scss" src="./task-editor.scss"></style>
