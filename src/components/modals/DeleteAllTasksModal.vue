<template>
  <Modal class="modal_size_sm" @closed="emit('cancel')" ref="modalRef">
    <form class="form" @submit.prevent ref="formRef">

      <div class="form__header">
        <div class="form__title title title_size_l title_color_red title_align_center">Are you sure you want to delete all tasks?</div>
        <div class="form__desc text text_color_gray text_align_center">You can't undo this action</div>
      </div>

      <div class="form__body">

        <div class="form__row form__row_controls">
          <button
            class="form__control-button form__control-button_scale_max button button_color_red"
            ref="cancelButtonRef"
            @click="modalRef.close"
          >Cancel</button>
          <button
            class="form__control-button form__control-button_scale_max button button_fill_red"
            @click="confirm"
          >Delete</button>
        </div>

      </div>

    </form>
  </Modal>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { delay, focusFirstElement, catchFocus, execWhenShiftEnter } from '@/utils/helpers'

const emit = defineEmits(['confirm', 'cancel', 'closed'])

// Modal

const modalRef = ref(null)

const confirm = (() => {
  let isConfirmed = false

  return (async () => {
    if (isConfirmed) return

    emit('confirm')
    await modalRef.value.close()
    emit('closed')

    isConfirmed = true
  })
})()

// Form

const formRef = ref(null)
const cancelButtonRef = ref(null)
let removeShiftEnterListener

onMounted(async () => {
  await delay().then(() => {
    focusFirstElement(formRef.value)
    catchFocus(formRef.value)
    removeShiftEnterListener = execWhenShiftEnter(confirm)
  })
  await delay().then(() => {
    cancelButtonRef.value.blur()
  })
})

onBeforeUnmount(() => {
  removeShiftEnterListener()
})
</script>
