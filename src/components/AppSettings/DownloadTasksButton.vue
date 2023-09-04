<template>
  <a
    class="download-todos__btn button button_type_icon-text"
    :href="json"
    :download="filename"
  >
    <span>Download tasks</span>
    <svg class="button__icon button__icon_stroke">
      <use xlink:href="#download"></use>
    </svg>
  </a>
</template>

<script setup>
import { useUserSettingsStore } from '@/stores/userSettings'
const userSettings = useUserSettingsStore()

const json = '{}'
const filename = ''

//export default {
//  name: 'download-tasks',
//  computed: {
//    ...mapGetters(['lists']),
//    dataJSON() {
//      return `data:text/json;charset=utf-8,${ encodeURIComponent(JSON.stringify(this.lists)) }`
//    },
//    filename() {
//      const now = new Date().toISOString()
//      return `sl-tasks-${ now }.json`
//    }
//  }
//}
</script>
