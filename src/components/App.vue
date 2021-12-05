<template>
  <div class="app">

    <div class="app__container">

      <div class="app__header">

        <div class="app__current-date">{{ currentDateString }}</div>
        
        <div class="app__logo">
          <div class="app__logo-text">Todolist</div>
          <div class="app__logo-icon"></div>
        </div>

        <div class="app__data-actions">
          <a class="app__data-link" :href="dataJSON" download="todos.json" title="Download data">
            <img class="app__data-link-img" src="../assets/images/export.svg" alt="Export">
          </a>
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
import { mapGetters } from 'vuex'

import ListsView from './ListsView.vue'
import TasksView from './TasksView.vue'

export default {
  name: 'app',
  components: {
    ListsView,
    TasksView
  },
  data() {
    return {
      currentDate: new Date()
    }
  },
  computed: {
    ...mapGetters(['lists']),
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
    },
    dataJSON() {
      return `data:text/json;charset=utf-8,${ encodeURIComponent(JSON.stringify(this.lists)) }`
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/utils/vars.scss';

.app {
  font-family: 'Open Sans', sans-serif;
  font-size: 14px;
  z-index: map-get($zLayers, "zIndexPage");
}

.app {
  width: 100vw;
  height: 100vh;
  padding: 16px;

  background-image: $mainBg;
}

.app__container {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 990px;
  height: 100%;
  margin: 0 auto;
  padding: 16px 0;
  
  background-color: #fff;
  border-radius: 8px;
  border: 1px solid #eee;
}

.app__header {
  display: flex;

  height: 56px;
  padding: 0 16px;
  position: relative;
}

.app__current-date {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 13px;
  font-weight: bold;
  color: $colorGray;
  white-space: nowrap;
}

.app__logo {
  display: block;
  margin: 0 auto;
  padding: 15px 38px 5px 5px;
  position: relative;
  text-align: center;
  user-select: none;
}

.app__logo-text {
  font-family: 'Galada', sans-serif;
  font-size: 36px;
  line-height: 1;
  color: $colorViolet;
  text-transform: capitalize;
  text-shadow: 0 3px 3px rgba(0, 0, 0, .1);
}

.app__logo-icon {
  display: block;
  width: 30px;
  height: 30px;
  position: absolute;
  right: 5px;
  bottom: 16px;
  background-image: url(../assets/images/quill.svg);
  background-position: 50%;
  background-repeat: no-repeat;
  background-size: 30px 30px;
  filter: drop-shadow(0 3px 3px rgba(0,0,0,.15));
}

.app__data-actions {
  display: flex;
  align-items: center;
}

.app__data-link {
  width: 30px;
  height: 30px;

  display: flex;
  justify-content: center;
  align-items: center;

  text-indent: -999px;
  border-radius: 50%;

  overflow: hidden;
  transition: opacity 0.15s ease;
}

.app__data-link-img {
  width: 14px;
  height: 14px;
  margin: 0 auto;

  display: block;

  object-fit: contain;
}

.app__data-link:hover {
  opacity: 0.8;
}

.app__body {
  display: flex;
  height: calc(100% - 56px);
}

.app__section {
  width: 100%;
  padding: 0 16px;
}

.app__section_side {
  width: 100%;
  max-width: 320px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  position: relative;
  border-right: 2px solid #eee;
}

.app__section_main {
  width: 100%;
  max-width: calc(100% - 320px);
}
</style>
