<template>
  <a class="download-todos__btn button button_type_icon-text"
    :href="dataJSON"
    :download="filename"
  >
    <span>Download tasks</span>
    <svg class="button__icon button__icon_stroke">
      <use xlink:href="#download"></use>
    </svg>
  </a>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'download-tasks',
  computed: {
    ...mapGetters(['lists']),
    dataJSON() {
      return `data:text/json;charset=utf-8,${ encodeURIComponent(JSON.stringify(this.lists)) }`
    },
    filename() {
      const now = new Date().toISOString()
      return `sl-tasks-${ now }.json`
    }
  }
}
</script>
