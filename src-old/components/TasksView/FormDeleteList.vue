<template>
  <form class="form"
    v-on:submit.prevent
  >

    <div class="form__header">
      <div class="form__title title title_size_l title_color_red title_align_center">You can't undo this action</div>
      <div class="form__desc text text_color_gray text_align_center">Are you sure you want to delete this list?</div>
    </div>

    <div class="form__body">

      <div class="form__row form__row_controls">
        <button class="form__control-button form__control-button_scale_max button button_color_red"
          ref="cancelButton"
          v-on:click="emitCancel"
        >Cancel</button>
        <button class="form__control-button form__control-button_scale_max button button_fill_red"
          v-on:click="emitSuccess"
        >Delete</button>
      </div>

    </div>

  </form>
</template>

<script>
import { catchFocus, execWhenShiftEnter } from '@/js/focusForm'

export default {
  name: 'form-delete-list',
  emits: ['success', 'cancel'],
  methods: {
    emitSuccess() {
      this.$emit('success')
    },
    emitCancel() {
      this.$emit('cancel')
    },
    activateFocus() {
      this.$refs.cancelButton.focus()
      this.$refs.cancelButton.blur()
    }
  },
  mounted() {
    this.removeShiftEnter = execWhenShiftEnter(this.emitSuccess)
    catchFocus(this.$el)
    this.activateFocus()
  },
  beforeUnmount() {
    this.removeShiftEnter()
  }
}
</script>
