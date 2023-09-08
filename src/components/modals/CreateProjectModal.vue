<template>
  <Modal class="modal_size_xsm" @closed="emit('cancel')" ref="modalRef">
    <template #header>
      <div class="modal__title title title_size_l">{{ title }}</div>
      <button
        class="button button_type_icon button_color_black modal__close-button"
        @click="modalRef.close"
      >
        <span>Cancel</span>
        <Icon class="button__icon button__icon_fill" name="close" />
      </button>
    </template>

    <template #default>
      <form class="form form_type_input" @submit.prevent ref="formRef">
        <div class="form__body">
          <div class="form__row form__row_input">
            <label class="form__label">
              <span class="form__label-name"
                >Name <span class="form__required-sign">*</span></span
              >
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
                />
                <Icon
                  class="form__icon form__icon_fill_red form__icon_pos_right_center"
                  name="warning"
                />
                <div class="form__input-warning" :class="nameWarningClasses">
                  {{ nameWarningText }}
                </div>
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

          <div class="form__row form__row_checkbox">
            <label class="form__label">
              <Checkbox v-model="resultData.extendedView" />
              <span class="form__label-name"
                >Extended view for tasks in preview mode</span
              >
            </label>
          </div>

          <div class="form__row form__row_controls">
            <input
              class="form__control-button form__control-button_scale_max button button_fill_violet"
              type="submit"
              @click.prevent="confirm"
              :value="confirmButtonText"
            />
          </div>
        </div>
      </form>
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
  extendedView: {
    type: Boolean,
    default: false
  },

  edit: {
    type: Boolean,
    default: false
  }
})

// Data

const resultData = reactive({
  name: props.name,
  icon: props.icon,
  extendedView: props.extendedView
})
const title = computed(() => {
  return props.edit ? 'Edit project' : 'New project'
})
const confirmButtonText = computed(() => {
  return props.edit ? 'Save changes' : 'Create'
})

// Modal window

const modalRef = ref(null)

const confirm = (() => {
  let isConfirmed = false

  return async () => {
    if (isConfirmed) return

    emit('confirm', resultData)
    await modalRef.value.close()
    emit('closed')

    isConfirmed = true
  }
})()

// Form

const formRef = ref(null)
let removeShiftEnterListener

onMounted(() => {
  delay().then(() => {
    focusFirstElement(formRef.value)
    catchFocus(formRef.value)
    removeShiftEnterListener = execWhenShiftEnter(confirm)
  })
})

onBeforeUnmount(() => {
  removeShiftEnterListener()
})
</script>
