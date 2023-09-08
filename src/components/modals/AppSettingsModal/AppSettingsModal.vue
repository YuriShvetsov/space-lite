<template>
  <Modal class="modal_size_sm" ref="modalWindow" @closed="emit('cancel')">
    <div class="app-settings">

      <div class="app-settings__header">
        <div class="app-settings__title title title_size_l">Settings</div>
        <transition name="fade-non-linear">
          <div class="fast-msg fast-msg_access" v-show="isSaveLabelVisible">Saved...</div>
        </transition>
        <button
          class="app-settings__close-button button button_type_icon button_color_black"
          @click="modalWindow.close"
        >
          <span>Close</span>
          <Icon class="button__icon button__icon_fill" name="close" />
        </button>
      </div>

      <div class="app-settings__body">

        <div class="app-settings__section">

          <div class="app-settings__section-title">General</div>

          <div class="app-settings__section-row app-settings__appearance">
            <div class="app-settings__text app-settings__text_left-pos text">Appearance:</div>
            <ThemeSwitcher class="app-settings__theme-switcher" @saved="showSaveLabel" />
          </div>

        </div>

        <div class="app-settings__section">

          <div class="app-settings__section-title">Data</div>

          <div class="app-settings__section-row">
            <div class="app-settings__section-subrow">
              <div class="app-settings__hidden-lists">
                <HiddenProjectsSwitcher @saved="showSaveLabel" />
                <div class="app-settings__text app-settings__text_right-pos text">Show hidden projects</div>
              </div>
              <div class="app-settings__hidden-tasks">
                <HiddenTasksSwitcher @saved="showSaveLabel" />
                <div class="app-settings__text app-settings__text_right-pos text">Show hidden tasks</div>
              </div>
            </div>
          </div>

          <div class="app-settings__section-row">
            <div class="app-settings__section-subrow">
              <DownloadTasksButton class="app-settings__download-button" />
              <ClearDataButton />
            </div>
            <div class="app-settings__section-subrow">
              <div class="app-settings__subtext">Import your tasks in another browser or if you have cleared the data</div>
            </div>
          </div>

        </div>

      </div>

    </div>
  </Modal>
</template>

<script setup>
import { delay } from '@/utils/helpers'

import { ref } from 'vue'

import ThemeSwitcher from './components/ThemeSwitcher.vue'
import HiddenProjectsSwitcher from './components/HiddenProjectsSwitcher.vue'
import HiddenTasksSwitcher from './components/HiddenTasksSwitcher.vue'
import DownloadTasksButton from './components/DownloadTasksButton.vue'
import ClearDataButton from './components/ClearDataButton.vue'

const emit = defineEmits(['cancel'])

const modalWindow = ref(null)
const isSaveLabelVisible = ref(false)

let showingSaveLabelTimeout = null
const showSaveLabel = async () => {
  if (isSaveLabelVisible.value) {
    showingSaveLabelTimeout.cancel()
    isSaveLabelVisible.value = false
    await delay(400)
  }

  isSaveLabelVisible.value = true
  showingSaveLabelTimeout = delay(1000, true)

  await showingSaveLabelTimeout.promise

  showingSaveLabelTimeout = null
  isSaveLabelVisible.value = false
}

</script>

<style lang="scss" scoped>
@import '@/assets/scss/env/index';

.app-settings {
  width: 100%;
  height: auto;
  font-family: $fontMain;
}

.app-settings__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 16px 60px 16px 20px;
  position: relative;
  background-color: get-light($bgColor, 'main');
  border-radius: 8px 8px 0 0;
  border-top: 1px solid get-light($sectionBorderColor);
  border-right: 1px solid get-light($sectionBorderColor);
  border-bottom: 1px solid get-light($sectionBorderColor);
  border-left: 1px solid get-light($sectionBorderColor);
}

.app-settings__body {
  padding: 4px 20px;
  background-color: get-light($bgColor, 'main');
  border-right: 1px solid get-light($sectionBorderColor);
  border-bottom: 1px solid get-light($sectionBorderColor);
  border-left: 1px solid get-light($sectionBorderColor);
  border-radius: 0 0 8px 8px;
}

.app-settings__text {
  font-size: 12px;
  line-height: 1em;
}

.app-settings__subtext {
  margin-top: 6px;
  font-size: 10px;
  line-height: 1em;
  color: get-light($secondaryTextColor);
}

.app-settings__close-button {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translate(-50%, -50%);
}

.app-settings__section {
  display: flex;
  flex-direction: column;
  gap: 4px;
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
  margin-bottom: 8px;
}

.app-settings__section-subrow {
  display: flex;
  align-items: center;
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

.app-settings__tooltip {
  margin-left: 6px;
}

.app-settings__hidden-lists,
.app-settings__hidden-tasks {
  display: flex;
  align-items: center;
}

.app-settings__hidden-lists {
  margin-right: 16px;
}

.app-settings__download-button {
  margin-right: 8px;
}

@include dark-theme {

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

  .app-settings__subtext {
    margin-top: 4px;
    font-size: 10px;
    line-height: 1em;
    color: get-dark($secondaryTextColor);
  }

}

</style>
