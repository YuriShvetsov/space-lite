<template>
  <a
    class="download-todos__btn button button_type_icon-text"
    disabled
    :href="json"
    :download="filename"
    @click.prevent
  >
    <span>Download tasks</span>
    <Icon class="button__icon button__icon_stroke" name="download" />
  </a>
</template>

<script setup>
import { useUserStore } from '@/stores/user/index.js'
const userStore = useUserStore()

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
