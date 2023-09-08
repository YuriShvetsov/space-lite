<template>
  <Modal class="modal_size_sm" @closed="emit('cancel')" ref="modalRef">
    <form class="form form_type_input" @submit.prevent ref="formRef">

      <div class="form__header">
        <div class="form__title title title_size_l">Create a new task</div>
      </div>

      <div class="form__body">

        <div class="form__row form__row_input">
          <label class="form__label">
            <span class="form__label-name">Name <span class="form__required-sign">*</span></span>
            <div class="form__input-wrapper">
              <input
                class="form__input form__input_type_text js-input"
                type="text"
                spellcheck="false"
                autocomplete="off"
                name="name"
                important
                v-model.trim="resultData.name"
                @keydown.enter.prevent
              >
              <Icon class="form__icon form__icon_fill_red form__icon_pos_right_center" name="warning" />
              <div class="form__input-warning" :class="nameWarningClasses">{{ nameWarningText }}</div>
            </div>
          </label>
        </div>

        <div class="form__row form__row_input">
          <label class="form__label">
            <span class="form__label-name">Description</span>
            <TextBox
              v-model="resultData.description"
              :spellcheck="false"
              :rows="7"
            />
          </label>
        </div>

        <div class="form__row form__row_input">
          <label class="form__label form__label_pointer-events-none">
            <span class="form__label-name">Priority</span>
          </label>
          <LineSelect
            v-model="resultData.priority"
            v-bind="priorityLineSelectSettings"
          />
        </div>

        <div class="form__row form__row_controls">
          <button
            class="form__control-button form__control-button_scale_2-5 button"
            @click="modalRef.close"
          >Cancel</button>
          <button
            class="form__control-button form__control-button_scale_3-5 button button_fill_violet"
            @click="confirm"
          >Create Task</button>
        </div>
      </div>

    </form>
  </Modal>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

import { delay, focusFirstElement, catchFocus, execWhenShiftEnter } from '@/utils/helpers'

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
  }
})
const priorityLineSelectSettings = {
  options: [
    {
      name: 'Minor',
      value: 'minor'
    },
    {
      name: 'Major',
      value: 'major'
    },
    {
      name: 'Critical',
      value: 'critical'
    }
  ]
}

// Data

const resultData = reactive({
  name: props.name,
  description: props.description,
  priority: props.priority,
  tags: props.tags
})

// Modal window

const modalRef = ref(null)

const confirm = (() => {
  let isConfirmed = false

  return (async () => {
    if (isConfirmed) return

    emit('confirm', resultData)
    await modalRef.value.close()
    emit('closed')

    isConfirmed = true
  })
})()

// Form

const formRef = ref(null)

onMounted(() => {
  delay().then(() => {
    focusFirstElement(formRef.value)
    catchFocus(formRef.value)
    execWhenShiftEnter(confirm)
  })
})

</script>
