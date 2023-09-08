<template>
  <Checkbox v-model="showHiddenTasks" />
</template>

<script setup>
import { ref, watch } from 'vue'
import { useUserStore } from '@/stores/user'

const emit = defineEmits(['saved'])

const userStore = useUserStore()

// Data

const showHiddenTasks = ref(userStore.showHiddenTasks)

watch(showHiddenTasks, async () => {
  await userStore.toggleShowHiddenTasks()
  emit('saved')
})
</script>
