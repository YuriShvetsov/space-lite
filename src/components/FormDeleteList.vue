<template>
  <form class="form"
    v-on:submit.prevent
  >

    <div class="form__header">
      <div class="form__title title title_size_m title_color_red">Deleting of list</div>
      <div class="form__desc text text_color_gray">Do you really want to delete this list along with all tasks?</div>
    </div>

    <div class="form__body">

      <div class="form__row form__row_x_center">
        <button class="form__control-button button button_fill_red"
          v-on:click="emitSuccess"
        >Yes</button>
        <button class="form__control-button button button_color_red"
          v-on:click="emitCancel"
        >No</button>
      </div>
      
    </div>
    
  </form>
</template>

<script>
import { focusFirstElement, catchFocus } from '../js/focusForm'

export default {
  name: 'form-delete-list',
  emits: ['success', 'cancel'],
  methods: {
    emitSuccess() {
      this.$emit('success')
    },
    emitCancel() {
      this.$emit('cancel')
    }
  },
  mounted() {
    focusFirstElement(this.$el)
    catchFocus(this.$el)
  }
}
</script>

<style scoped lang="scss">
.form__title {
  margin-bottom: 10px;
}
</style>
