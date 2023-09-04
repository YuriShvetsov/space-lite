<template>
  <button
    class="clear-all-data__btn button button_type_icon-text button_color_red"
    @click="lists.removeAllLists"
  >
    <span>Clear data</span>
    <svg class="button__icon button__icon_stroke">
      <use xlink:href="#delete"></use>
    </svg>
  </button>
</template>

<script setup>
import { useListsStore } from '@/stores/lists'
const lists = useListsStore()
</script>
