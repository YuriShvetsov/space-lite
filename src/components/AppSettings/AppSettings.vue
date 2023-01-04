<template>
  <div :class="containerClassNames">

    <div class="app-settings__header">
      <div class="app-settings__title title title_size_l">Settings</div>
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

      <div class="app-settings__section">

        <div class="app-settings__section-title">General</div>

        <div class="app-settings__section-row app-settings__appearance">
          <div class="app-settings__text app-settings__text_left-pos text">Appearance:</div>
          <theme-switcher class="app-settings__theme-switcher" />
        </div>

      </div>

      <div class="app-settings__section">

        <div class="app-settings__section-title">Data</div>

        <div class="app-settings__section-row app-settings__hidden-todos">
          <hidden-todos-switcher />
          <div class="app-settings__text app-settings__text_right-pos text">Show hidden tasks</div>
        </div>

        <div class="app-settings__section-row app-settings__download-todos">
          <div class="app-settings__text app-settings__text_left-pos text">Save your tasks in a json file:</div>
          <download-tasks-button />
          <div class="app-settings__tooltip tooltip">
            <svg class="tooltip__icon">
              <use xlink:href="#information-circle"></use>
            </svg>
            <div class="tooltip__content text text_color_gray" style="width: 300px;">
              <span>You can import your tasks in another browser or if you have cleared the local storage</span>
            </div>
          </div>
        </div>

      </div>

    </div>

  </div>  
</template>

<script>
import { mapGetters } from 'vuex'

import ThemeSwitcher from './ThemeSwitcher.vue'
import HiddenTodosSwitcher from './HiddenTodosSwitcher.vue'
import DownloadTasksButton from './DownloadTasksButton.vue'

export default {
  name: 'app-settings',
  components: {
    ThemeSwitcher,
    HiddenTodosSwitcher,
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
@import 'assets/scss/env';

.app-settings {
  width: 100%;
  height: auto;
}

.app-settings__header {
  width: 100%;
  padding: 16px 20px;
  position: relative;
  background-color: get-light($bgColor, 'main');
  border-radius: 8px 8px 0 0;
  border-bottom: 1px solid get-light($sectionBorderColor);
  border-top: 1px solid transparent;
  border-right: 1px solid transparent;
  border-left: 1px solid transparent;
}

.app-settings__body {
  padding: 4px 20px;
  background-color: get-light($bgColor, 'main');
  border-right: 1px solid transparent;
  border-bottom: 1px solid transparent;
  border-left: 1px solid transparent;
  border-radius: 0 0 8px 8px;
}

.app-settings__text {
  font-size: 12px;
  line-height: 1em;
}

.app-settings__close-button {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translate(-50%, -50%);
}

.app-settings__section {
  padding: 12px 0;
}

.app-settings__section:not(:first-child) {
  border-top: 1px solid transparent;
  position: relative;

  &::before {
    content: '';
    display: block;
    width: 100%;
    height: 1px;
    position: absolute;
    left: 50%;
    top: -1px;
    transform: translate(-50%, 0);

    background-image: linear-gradient(
      to right,
      rgba(255, 255, 255, 0),
      rgba(0, 0, 0, 0.05) 10%,
      rgba(0, 0, 0, .1) 50%,
      rgba(0, 0, 0, 0.05) 90%,
      rgba(255, 255, 255, 0)
    );
  }
}

.app-settings__section-title {
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: bold;
}

.app-settings__section-row:not(:last-child) {
  margin-bottom: 6px;
}

.app-settings__text_left-pos {
  margin-right: 8px;
}

.app-settings__text_right-pos {
  margin-left: 8px;
}

// Modules

.app-settings__appearance {
  display: flex;
  align-items: center;
}

.app-settings__theme-switcher {
  padding: 0 10px;
}

.app-settings__hidden-todos {
  display: flex;
  align-items: center;
}

.app-settings__download-todos {
  display: flex;
  align-items: center;
}

.app-settings__tooltip {
  margin-left: 6px;
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

  .app-settings__section:not(:first-child)::before {
    background-image: linear-gradient(
      to right,
      rgba(0, 0, 0, 0),
      rgba(255, 255, 255, .08) 10%,
      rgba(255, 255, 255, .2) 50%,
      rgba(255, 255, 255, .08) 90%,
      rgba(0, 0, 0, 0)
    );
  }

  .app-settings__section-title {
    color: #fff;
  }

}

</style>
