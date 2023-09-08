<template>
  <button
    class="clear-all-data__btn button button_type_icon-text button_color_red"
    @click="lists.removeAllLists"
    disabled
  >
    <span>Clear data</span>
    <Icon class="button__icon button__icon_stroke" name="delete" />
  </button>
</template>

<script setup>
import { useListsStore } from '@/stores/lists/index.js'
const lists = useListsStore()
</script>
