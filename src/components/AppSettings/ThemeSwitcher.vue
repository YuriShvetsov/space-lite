<template>
  <radio
    :items="modifiedThemesList"
    :current="userStore.theme"
    @update="onUpdateRadio"
    :disabled="isSaving"
  />
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const emit = defineEmits(['saved'])

const modifiedThemesList = computed(() => {
  return userStore.availableThemes.map(theme => {
    const name = `${ theme[0].toUpperCase() }${ theme.slice(1) }`
    const value = theme

    return { name, value }
  })
})

const isSaving = ref(false)
const onUpdateRadio = async value => {
  if (value === userStore.theme || isSaving.value) return

  isSaving.value = true
  await userStore.setTheme(value)
  isSaving.value = false
  emit('saved')
}
</script>
