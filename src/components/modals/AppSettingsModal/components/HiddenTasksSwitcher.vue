<template>
  <Checkbox
    :checked="userStore.showHiddenTasks"
    @change="onChangeCheckbox"
  />
</template>

<script setup>
import { useUserStore } from '@/stores/user/index.js'

const emit = defineEmits(['saved'])

const userStore = useUserStore()

const onChangeCheckbox = async () => {
  await userStore.toggleShowHiddenTasks()
  emit('saved')
}
</script>
