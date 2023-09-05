<template>
  <modal class="modal_size_xsm" ref="modalWindow" @closed="emit('cancel')">
    <form class="form form_type_input" @submit.prevent>

      <div class="form__header">
        <div class="form__title title title_size_l">Create a new list</div>
        <button
          class="form__cancel-button button button_type_icon button_color_black"
          @click="modalWindow.close"
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
                :icons="LIST_ICONS"
              />
            </div>
          </label>
        </div>

        <div class="form__row form__row_controls">
          <input
            class="form__control-button form__control-button_scale_max button button_fill_violet"
            type="submit"
            @click.prevent="confirm"
            value="Create List"
          >
        </div>

      </div>

    </form>
  </modal>
</template>

<script setup>
import { ref, reactive } from 'vue'

import { focusFirstElement, catchFocus, execWhenShiftEnter } from '@/js/focusForm.js'
import { DEFAULT_LIST_ICON, LIST_ICONS } from '@/js/static/listIcons.js'

const emit = defineEmits(['cancel', 'confirm', 'closed'])

// Data

const resultData = reactive({
  name: '',
  icon: DEFAULT_LIST_ICON
})

// Modal window

const modalWindow = ref(null)

const confirm = async () => {
  emit('confirm', resultData)
  await modalWindow.value.close()
  emit('closed')
}

// Icons



</script>
