<template>
  <checkbox
    :checked="userSettings.showHiddenTasks"
    @change="userSettings.toggleShowHiddenTasks"
  />
</template>

<script setup>
import { useUserSettingsStore } from '@/stores/userSettings'
const userSettings = useUserSettingsStore()
</script>
