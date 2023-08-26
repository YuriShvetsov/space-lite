<template>
  <button
    class="clear-all-data__btn button button_type_icon-text button_color_red"
    @click="removeAllLists"
  >
    <span>Clear data</span>
    <svg class="button__icon button__icon_stroke">
      <use xlink:href="#delete"></use>
    </svg>
  </button>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'clear-data-button',
  methods: {
    ...mapActions(['removeAllLists'])
  }
}
</script>
