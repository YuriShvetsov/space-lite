<template>
  <form class="form"
    v-on:submit.prevent
  >

    <div class="form__header">
      <div class="form__title title title_size_l title_color_red">Delete this list</div>
      <div class="form__desc text text_color_gray">Do you really want to delete this list along with all tasks?</div>
    </div>

    <div class="form__body">

      <div class="form__row form__row_controls">
        <button class="form__control-button form__control-button_scale_max button button_color_red"
          ref="cancelButton"
          v-on:click="emitCancel"
        >No</button>
        <button class="form__control-button form__control-button_scale_max button button_fill_red"
          v-on:click="emitSuccess"
        >Yes</button>
      </div>
      
    </div>
    
  </form>
</template>

<script>
import { catchFocus, execWhenShiftEnter } from '../js/focusForm'

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
    focusOnCancelButton() {
      this.$refs.cancelButton.focus()
    }
  },
  mounted() {
    this.removeShiftEnter = execWhenShiftEnter(this.emitSuccess)

    this.focusOnCancelButton()
    catchFocus(this.$el)
  },
  beforeUnmount() {
    this.removeShiftEnter()
  }
}
</script>
