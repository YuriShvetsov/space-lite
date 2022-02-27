<template>
  <div class="app-settings">

    <div class="app-settings__header">
      <div class="app-settings__title title title_size_s title_color_violet">App settings</div>
      <button class="app-settings__close-button button button_type_icon button_color_black"
        v-on:click="emitClose"
      >
        <span>Close</span>
        <svg class="button__icon button__icon_fill">
          <use xlink:href="#close"></use>
        </svg>
      </button>
    </div>

    <div class="app-settings__body">

      <div class="app-settings__row">
        <div class="app-settings__col">
          <div class="app-settings__text">Do you want to download your tasks in json?</div>
        </div>
        <div class="app-settings__col app-settings__col_vertical_center">
          <a class="download-todos__btn button button_type_text-icon"
              :href="dataJSON"
              download="todos.json"
            >
            <span>Download</span>
            <svg class="button__icon button__icon_fill">
              <use xlink:href="#export"></use>
            </svg>
          </a>
        </div>
      </div>

    </div>

  </div>  
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'app-settings',
  emits: ['close'],
  computed: {
    ...mapGetters(['lists']),
    dataJSON() {
      return `data:text/json;charset=utf-8,${ encodeURIComponent(JSON.stringify(this.lists)) }`
    }
  },
  methods: {
    emitClose() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/utils/vars.scss';

.app-settings {
  width: 100%;
  height: auto;
}

.app-settings__header {
  width: 100%;
  position: relative;
}

.app-settings__title {
  margin-bottom: 15px;
}

.app-settings__close-button {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translate(100%, -50%);
}

.app-settings__row {
  display: flex;
  justify-content: space-between;
  flex-wrap: nowrap;
  padding: 10px 0;
}

.app-settings__row:not(:first-child) {
  border-top: 1px solid #eee;
}

.app-settings__col:not(:last-child) {
  padding-right: 16px;
}

.app-settings__col_vertical_center {
  display: flex;
  align-items: center;
}
</style>
