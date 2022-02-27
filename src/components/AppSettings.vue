<template>
  <div :class="containerClassNames">

    <div class="app-settings__header">
      <div class="app-settings__title title title_size_s title_color_primary">App settings</div>
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
        <div class="app-settings__col app-settings__col_vertical_center">
          <div class="app-settings__text text">Appearance:</div>
        </div>
        <div class="app-settings__col app-settings__col_vertical_center">
          <theme-switcher></theme-switcher>
        </div>
      </div>

      <!-- <div class="app-settings__row">
        <div class="app-settings__col app-settings__col_vertical_center" style="opacity: 0.5;">
          <div class="app-settings__text text">Show archive list:</div>
        </div>
        <div class="app-settings__col app-settings__col_vertical_center" style="opacity: 0.5;">
          <archive-switcher></archive-switcher>
        </div>
      </div> -->

      <!-- <div class="app-settings__row">
        <div class="app-settings__col app-settings__col_vertical_center" style="opacity: 0.5;">
          <div class="app-settings__text text">Show hidden lists:</div>
        </div>
        <div class="app-settings__col app-settings__col_vertical_center" style="opacity: 0.5;">
          <hidden-lists-switcher></hidden-lists-switcher>
        </div>
      </div> -->

      <div class="app-settings__row">
        <div class="app-settings__col app-settings__col_vertical_center">
          <div class="app-settings__text text">Download tasks in json:</div>
        </div>
        <div class="app-settings__col app-settings__col_vertical_center">
          <download-tasks-button></download-tasks-button>
        </div>
      </div>

    </div>

  </div>  
</template>

<script>
import { mapGetters } from 'vuex'

import ThemeSwitcher from './ThemeSwitcher.vue'
import ArchiveSwitcher from './ArchiveSwitcher.vue'
import HiddenListsSwitcher from './HiddenListsSwitcher.vue'
import DownloadTasksButton from './DownloadTasksButton.vue'


export default {
  name: 'app-settings',
  components: {
    ThemeSwitcher,
    ArchiveSwitcher,
    HiddenListsSwitcher,
    DownloadTasksButton
  },
  emits: ['close'],
  computed: {
    ...mapGetters(['curThemeIsDark']),
    containerClassNames() {
      return {
        'app-settings': true,
        'app-settings_theme_dark': this.curThemeIsDark
      }
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
@import '../assets/scss/env';

.app-settings {
  width: 100%;
  height: auto;
}

.app-settings__header {
  width: 100%;
  padding: 18px 30px;
  position: relative;
  background-color: get-light($bgColor, 'main');
  border-radius: 8px 8px 0 0;
  border-bottom: 1px solid get-light($sectionBorderColor);
}

.app-settings__body {
  padding: 12px 30px;
  background-color: get-light($bgColor, 'main');
  border-radius: 0 0 8px 8px;
}

.app-settings__text {
  font-size: 13px;
}

.app-settings__close-button {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translate(-50%, -50%);
}

.app-settings__row {
  display: flex;
  justify-content: space-between;
  flex-wrap: nowrap;
  padding: 10px 0;
}

.app-settings__row:not(:first-child) {
  border-top: 1px solid get-light($sectionBorderColor);
}

.app-settings__col:not(:last-child) {
  padding-right: 16px;
}

.app-settings__col_vertical_center {
  display: flex;
  align-items: center;
}

// Dark theme

.app_theme_dark {

  .app-settings__header {
    background-color: get-dark($bgColor, 'main');
    border-top: 1px solid get-dark($formBorderColor);
    border-right: 1px solid get-dark($formBorderColor);
    border-bottom: 1px solid get-dark($sectionBorderColor);
    border-left: 1px solid get-dark($formBorderColor);
  }

  .app-settings__body {
    background-color: get-dark($bgColor, 'second');
    border-right: 1px solid get-dark($formBorderColor);
    border-bottom: 1px solid get-dark($formBorderColor);
    border-left: 1px solid get-dark($formBorderColor);
  }

  .app-settings__row:not(:first-child) {
    border-top: 1px solid get-dark($sectionBorderColor);
  }

}

</style>
