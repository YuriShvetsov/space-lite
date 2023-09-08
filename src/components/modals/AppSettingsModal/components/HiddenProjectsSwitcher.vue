<template>
  <Checkbox v-model="showHiddenProjects" />
</template>

<script setup>
import { ref, watch } from 'vue'
import { useUserStore } from '@/stores/user'

const emit = defineEmits(['saved'])

const userStore = useUserStore()

// Data

const showHiddenProjects = ref(userStore.showHiddenProjects)

watch(showHiddenProjects, async () => {
  await userStore.toggleShowHiddenProjects()
  emit('saved')
})
</script>
