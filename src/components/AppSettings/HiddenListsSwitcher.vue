<template>
  <checkbox
    :checked="userStore.showHiddenLists"
    @change="onChangeCheckbox"
  />
</template>

<script setup>
import { useUserStore } from '@/stores/user'

const emit = defineEmits(['saved'])

const userStore = useUserStore()

const onChangeCheckbox = async () => {
  await userStore.toggleShowHiddenLists()
  emit('saved')
}
</script>
