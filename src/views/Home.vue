<template>
  <div class="home">
    <Sprite />
    <div class="home__container">
      <div class="home__header">
        <div class="home__current-date">
          <Icon class="home__current-date-icon" name="calendar" />
          <span class="home__current-date-value">{{
            formattedCurrentDate
          }}</span>
        </div>

        <div class="home__logo">
          <div class="home__logo-text">Space Lite</div>
          <img
            class="home__logo-icon home__logo-icon_default"
            src="/images/stylus.png"
            alt="stylus"
          />
          <img
            class="home__logo-icon home__logo-icon_white"
            src="/images/stylus-white.png"
            alt="stylus"
          />
        </div>

        <div class="home__settings">
          <button
            class="home__settings-button button button_type_icon button_color_black"
            @:click="openSettingsModal"
          >
            <span>Settings</span>
            <Icon class="button__icon button__icon_stroke" name="settings" />
          </button>

          <teleport to="#dialog">
            <AppSettings
              v-if="isSettingsModalOpened"
              @cancel="onCloseSettingsModal"
            />
          </teleport>
        </div>
      </div>

      <div class="home__body">
        <div class="home__section home__section_side">
          <ProjectsViewer />
        </div>

        <div class="home__section home__section_main">
          <TasksViewer />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useConfirmDialog } from '@vueuse/core'
import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'

import { delay } from '@/utils/helpers'

import { useUserStore } from '@/stores/user'

import Sprite from '@/components/Sprite.vue'
import AppSettings from '@/components/modals/AppSettingsModal/AppSettingsModal.vue'
import ProjectsViewer from '@/components/ProjectsViewer/ProjectsViewer.vue'
import TasksViewer from '@/components/TasksViewer/TasksViewer.vue'

dayjs.extend(advancedFormat)

// User settings

const userStore = useUserStore()
const updateAppTheme = () => {
  if (userStore.isDarkTheme) {
    document.documentElement.setAttribute('data-theme', 'dark')
  } else {
    document.documentElement.removeAttribute('data-theme')
  }
}

updateAppTheme()

watch(userStore, updateAppTheme, { deep: true })

const {
  reveal: openSettingsModal,
  cancel: onCloseSettingsModal,
  isRevealed: isSettingsModalOpened
} = useConfirmDialog()

// Current date

const formattedCurrentDate = ref(null)
const updateCurrentDate = () => {
  formattedCurrentDate.value = dayjs().format('dddd, Do MMMM')
}

async function scheduleUpdateCurrentDate() {
  await delay(1000)
  updateCurrentDate()
  await scheduleUpdateCurrentDate()
}

updateCurrentDate()
scheduleUpdateCurrentDate()
</script>

<style lang="scss" scoped>
@import '@/assets/scss/env';

.home {
  width: 100vw;
  height: 100vh;
  padding: 0 16px 16px;
  position: relative;
  z-index: get-layer('page');

  font-family: $fontMain;
  font-size: 14px;

  background-image: get-light($mainBg);
}

.home__container {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 990px;
  height: 100%;
  margin: 0 auto;
}

.home__header {
  display: flex;
  justify-content: flex-end;
  height: 80px;
  padding: 16px 20px;
  position: relative;
}

.home__current-date {
  padding-left: 24px;
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);

  font-size: 12px;
  font-weight: bold;
  color: lighten(get-light($secondaryTextColor), 12%);
  white-space: nowrap;

  user-select: none;

  &-icon {
    width: 16px;
    height: 16px;
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    stroke: lighten(get-light($secondaryTextColor), 12%);
  }
}

.home__logo {
  display: block;
  margin: 0 auto;
  padding: 10px 48px 5px 5px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  user-select: none;
}

.home__logo-text {
  font-family: $fontLogo;
  font-size: 30px;
  font-weight: bold;
  line-height: 1;
  color: darken($primaryColor, 35%);
  text-transform: capitalize;
  text-shadow: 0 3px 3px rgba(0, 0, 0, 0.05);
}

.home__logo-icon {
  display: block;
  width: 42px;
  height: 42px;
  position: absolute;
  right: 0;
  top: 50%;
  transform: translate(0, calc(-50% - 2px));
  filter: drop-shadow(0 3px 3px rgba(0, 0, 0, 0.05));

  &_default {
    opacity: 1;
  }

  &_white {
    opacity: 0;
  }
}

.home__settings {
  display: flex;
  align-items: center;
}

.home__body {
  display: flex;
  height: calc(100% - 80px);

  background-color: get-light($bgColor, 'main');
  border: 1px solid get-light($sectionBorderColor);
  border-radius: 12px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.03);
}

.home__section {
  width: 100%;
  padding: 20px;
}

.home__section_side {
  width: 100%;
  max-width: 320px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  position: relative;
  border-right: 1px solid get-light($sectionBorderColor);
}

.home__section_main {
  width: 100%;
  max-width: calc(100% - 320px);
  position: relative;
}

@include desktop-screen {
  .home {
    padding: 0;
  }

  .home__container {
    max-width: unset;
    border-radius: 0;
  }

  .home__header,
  .home__body {
    border-left: none;
    border-right: none;
    border-bottom: none;
    border-radius: 0;
    box-shadow: none;
  }

  .home__section_side {
    max-width: 300px;
  }

  .home__section_main {
    max-width: calc(100% - 300px);
  }
}

@include dark-theme {
  .home {
    background-color: #000000;
    background-image: get-dark($mainBg);
  }

  .home__current-date {
    color: get-dark($baseTextColor);

    &-icon {
      stroke: get-dark($baseTextColor);
    }
  }

  .home__logo-text {
    color: get-dark($baseTextColor);
    text-shadow: 0 3px 3px rgba(0, 0, 0, 0.1);
  }

  .home__logo-icon_default {
    opacity: 0;
  }

  .home__logo-icon_white {
    opacity: 1;
    filter: drop-shadow(0 3px 3px rgba(0, 0, 0, 0.2));
  }

  .home__body {
    background-color: get-dark($bgColor, 'main');
    border: 1px solid get-dark($sectionBorderColor);
  }

  .home__section_side {
    border-right: 1px solid get-dark($sectionBorderColor);
  }

  @include desktop-screen {
    .app__body {
      border-left: none;
      border-right: none;
      border-bottom: none;
    }
  }
}
</style>
