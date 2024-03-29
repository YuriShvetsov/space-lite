<template>
  <div class="app" :class="appClasses">

    <sprite></sprite>

    <div class="app__container">

      <div class="app__header">

        <div class="app__current-date">
          <svg class="app__current-date-icon">
            <use xlink:href="#calendar"></use>
          </svg>
          <span class="app__current-date-value">{{ currentDateString }}</span>
        </div>

        <div class="app__logo">
          <div class="app__logo-text">Space Lite</div>
          <img class="app__logo-icon app__logo-icon_default" src="/images/stylus.png" alt="stylus">
          <img class="app__logo-icon app__logo-icon_white" src="/images/stylus-white.png" alt="stylus">
        </div>

        <div class="app__settings">

          <button class="app__settings-button button button_type_icon button_color_black"
            v-on:click="openModalAppSettings"
          >
            <span>Settings</span>
            <svg class="button__icon button__icon_stroke">
              <use xlink:href="#settings"></use>
            </svg>
          </button>

          <modal
            :classNames="['modal_size_sm']"
            ref="modalAppSettings"
          >
            <template v-slot:default>
              <app-settings @close="closeModalAppSettings" />
            </template>
          </modal>

        </div>

      </div>

      <div class="app__body">

        <div class="app__section app__section_side">
          <lists-view></lists-view>
        </div>

        <div class="app__section app__section_main">
          <tasks-view></tasks-view>
        </div>

      </div>

    </div>

  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import Sprite from './Sprite.vue'
import AppSettings from './AppSettings/AppSettings.vue'
import ListsView from './ListsView/ListsView.vue'
import TasksView from './TasksView/TasksView.vue'

export default {
  name: 'app',
  components: {
    Sprite,
    AppSettings,
    ListsView,
    TasksView
  },
  data() {
    return {
      currentDate: null
    }
  },
  computed: {
    ...mapGetters(['lists', 'curThemeIsDark', 'curThemeIsAuto', 'systemAppearanceIsDark']),
    isThemeDark() {
      return this.curThemeIsDark || (this.curThemeIsAuto && this.systemAppearanceIsDark)
    },
    appClasses() {
      return { 'app_theme_dark': this.isThemeDark }
    },
    currentDateString() {
      const weekdayNames = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
      ]
      const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
      ]

      const day = this.currentDate.getDate()
      const dayEnding = getDayEnding(day)
      const weekday = weekdayNames[this.currentDate.getDay()]
      const month = monthNames[this.currentDate.getMonth()]

      function getDayEnding(num) {
        if (num >= 11 && num <= 19) return 'th'
        if (+num.toString().slice(-1) === 1) return 'st'
        if (+num.toString().slice(-1) === 2) return 'nd'
        if (+num.toString().slice(-1) === 3) return 'rd'

        return 'th'
      }

      return `${ weekday }, ${ day }${ dayEnding } ${ month }`
    }
  },
  watch: {
    isThemeDark() {
      this.updateBodyStyles()
    },
  },
  methods: {
    ...mapActions(['migrate']),
    updateCurrentDate() {
      this.currentDate = new Date()
    },
    scheduleUpdateCurrentDate() {
      const timeout = 1000

      setTimeout(() => {
        this.updateCurrentDate()
        this.scheduleUpdateCurrentDate()
      }, timeout)
    },
    updateBodyStyles() {
      document.body.style.backgroundColor = this.isThemeDark ? '#333' : '#fff'
    },
    openModalAppSettings() {
      this.$refs.modalAppSettings.open()
    },
    closeModalAppSettings() {
      this.$refs.modalAppSettings.close()
    },
  },
  created() {
    // this.migrate()
    this.updateCurrentDate()
    this.scheduleUpdateCurrentDate();
  },
  mounted() {
    this.updateBodyStyles()
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/env';

.app {
  width: 100vw;
  height: 100vh;
  padding: 0 16px 16px;
  z-index: get-layer('page');

  font-family: $fontMain;
  font-size: 14px;

  background-image: get-light($mainBg);
}

.app__container {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 990px;
  height: 100%;
  margin: 0 auto;
}

.app__header {
  display: flex;
  justify-content: flex-end;
  height: 80px;
  padding: 16px 20px;
  position: relative;
}

.app__current-date {
  padding-left: 24px;
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);

  font-size: 12px;
  font-weight: bold;
  color: lighten(get-light($secondaryTextColor), 12%);
  white-space: nowrap;

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

.app__logo {
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

.app__logo-text {
  font-family: $fontLogo;
  font-size: 30px;
  font-weight: bold;
  line-height: 1;
  color: darken( $primaryColor, 35%);
  text-transform: capitalize;
  text-shadow: 0 3px 3px rgba(0, 0, 0, .05);
}

.app__logo-icon {
  display: block;
  width: 42px;
  height: 42px;
  position: absolute;
  right: 0;
  top: 50%;
  transform: translate(0, calc(-50% - 2px));
  filter: drop-shadow(0 3px 3px rgba(0, 0, 0, .05));

  &_default {
    opacity: 1;
  }

  &_white {
    opacity: 0;
  }
}

.app__settings {
  display: flex;
  align-items: center;
}

.app__body {
  display: flex;
  height: calc(100% - 80px);

  background-color: get-light($bgColor, 'main');
  border: 1px solid get-light($sectionBorderColor);
  border-radius: 12px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.03);
}

.app__section {
  width: 100%;
  padding: 16px;
}

.app__section_side {
  width: 100%;
  max-width: 300px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  position: relative;
  border-right: 1px solid get-light($sectionBorderColor);
}

.app__section_main {
  width: 100%;
  max-width: calc(100% - 300px);
}

// Dark theme

.app_theme_dark {
  background-color: #000000;
  background-image: get-dark($mainBg);
}

.app_theme_dark {

  .app__current-date {
    color: get-dark($baseTextColor);

    &-icon {
      stroke: get-dark($baseTextColor);
    }
  }

  .app__logo-text {
    color: get-dark($baseTextColor);
    text-shadow: 0 3px 3px rgba(0, 0, 0, 0.1);
  }

  .app__logo-icon_default {
    opacity: 0;
  }

  .app__logo-icon_white {
    opacity: 1;
    filter: drop-shadow(0 3px 3px rgba(0, 0, 0, 0.2));
  }

  .app__body {
    background-color: get-dark($bgColor, 'main');
    border: 1px solid get-dark($sectionBorderColor);
  }

  .app__section_side {
    border-right: 1px solid get-dark($sectionBorderColor);
  }

}

@include desktop-screen {
  .app {
    padding: 0;
  }

  .app__container {
    max-width: unset;
    border-radius: 0;
  }

  .app__header,
  .app__body {
    border-left: none;
    border-right: none;
    border-bottom: none;
    border-radius: 0;
    box-shadow: none;
  }

  .app__section_side {
    max-width: 300px;
  }

  .app__section_main {
    max-width: calc(100% - 300px);
  }

  // Dark theme

  .app_theme_dark {

    .app__body {
      border-left: none;
      border-right: none;
      border-bottom: none;
    }

  }
}
</style>
