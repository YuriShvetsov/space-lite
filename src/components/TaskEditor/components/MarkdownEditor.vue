<template>
  <div class="task-editor__markdown-editor" ref="root"></div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { EditorView } from 'codemirror'
import { EditorState } from "@codemirror/state"
import { markdown } from '@codemirror/lang-markdown'
import { basicLight } from 'cm6-theme-basic-light'

const emit = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: {
    type: String,
    default: () => ''
  }
})

// Data

const root = ref(null)
const editor = ref(null)
const modelValue = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})

modelValue.value = props.modelValue

// Methods

const initEditor = () => {
  editor.value = new EditorView({
    state: EditorState.create({
      extensions: [
        EditorView.updateListener.of(function(e) {
          modelValue.value = e.state.doc.toString()
        }),
        markdown(),
        basicLight
      ]
    }),
    parent: root.value
  })
}

onMounted(() => {
  initEditor();
  setTimeout(() => {
    // editor.value.dispatch({
    //   changes: {
    //     from: 0,
    //     to: editor.value.state.doc.length,
    //     insert: modelValue.value
    //   }
    // })

    editor.value.state.update({
      changes: {
        from: 0,
        to: editor.value.state.doc.length,
        // insert: modelValue.value
        insert: '### New title'
      }
    })
  })
})

</script>

<style lang="scss" src="./markdown-editor.scss"></style>
