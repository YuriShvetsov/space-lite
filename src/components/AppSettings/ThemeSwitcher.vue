<template>
  <radio
    :items="modifiedThemesList"
    :current="userSettings.theme"
    @update="onUpdateRadio"
  />
</template>

<script setup>
import { computed } from 'vue'
import { useUserSettingsStore } from '@/stores/userSettings'

const userSettings = useUserSettingsStore()
const modifiedThemesList = computed(() => {
  return userSettings.availableThemes.map(theme => {
    const name = `${ theme[0].toUpperCase() }${ theme.slice(1) }`
    const value = theme

    return { name, value }
  })
})
const onUpdateRadio = value => {
  if (value === userSettings.theme) return
  userSettings.setTheme(value)
}
</script>
