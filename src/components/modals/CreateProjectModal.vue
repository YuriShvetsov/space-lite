<template>
  <Modal class="modal_size_xsm" @closed="emit('cancel')" ref="modalRef">
    <form class="form form_type_input" @submit.prevent ref="formRef">

      <div class="form__header">
        <div class="form__title title title_size_l">{{ title }}</div>
        <button
          class="form__cancel-button button button_type_icon button_color_black"
          @click="modalRef.close"
        >
          <span>Cancel</span>
          <Icon class="button__icon button__icon_fill" name="close" />
        </button>
      </div>

      <div class="form__body">

        <div class="form__row form__row_input">
          <label class="form__label">
            <span class="form__label-name">Name <span class="form__required-sign">*</span></span>
            <div class="form__input-wrapper">
              <input
                type="text"
                spellcheck="false"
                autocomplete="off"
                name="name"
                important
                class="form__input form__input_type_text js-input"
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
            <span class="form__label-name">Icon</span>
            <div class="form__input-wrapper">
              <IconSelector
                v-model="resultData.icon"
                :icons="PROJECT_ICONS"
              />
            </div>
          </label>
        </div>

        <div class="form__row form__row_controls">
          <input
            class="form__control-button form__control-button_scale_max button button_fill_violet"
            type="submit"
            @click.prevent="confirm"
            :value="confirmButtonText"
          >
        </div>

      </div>

    </form>
  </Modal>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'

import { delay, focusFirstElement, catchFocus, execWhenShiftEnter } from '@/utils/helpers'
import { DEFAULT_PROJECT_ICON, PROJECT_ICONS } from '@/static/projectIcons'

const emit = defineEmits(['confirm', 'cancel', 'closed'])
const props = defineProps({
  name: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: DEFAULT_PROJECT_ICON
  },
  edit: {
    type: Boolean,
    default: false
  }
})

// Data

const resultData = reactive({
  name: props.name,
  icon: props.icon
})
const title = computed(() => {
  return props.edit ? 'Edit project' : 'Create a new project'
})
const confirmButtonText = computed(() => {
  return props.edit ? 'Save Changes' : 'Create Project'
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
