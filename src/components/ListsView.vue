<template>
  <div class="lists-view">

    <div class="lists-view__header">
      <div class="lists-view__title title title_size_m">My lists</div>
      <button class="lists-view__add-button button button_type_icon-text"
        v-on:click="openModalAddList"
      >
        <span>List</span>
        <svg class="button__icon button__icon_stroke">
          <use xlink:href="#plus"></use>
        </svg>
      </button>
    </div>

    <div class="lists-view__body scrollable-wrapper">

      <div class="lists-view__scroll-trigger lists-view__scroll-trigger_top"
          ref="topScrollTrigger"
        ></div>
        <div class="lists-view__scroll-trigger lists-view__scroll-trigger_bottom"
          ref="bottomScrollTrigger"
        ></div>

      <ul class="lists-view__ul scrollable-child"
        ref="lists"
      >
        <transition-group name="flip-list" :css="false">
          <list-item
            v-for="list in lists"
            v-bind:key="list.id"
            v-bind:data-id="list.id"
            v-bind="list"
            v-bind:isActive="listIsOpened(list.id)"
            v-on:start-moving="onStartListMoving"
            v-on:mouseover="setHoverList(list.id)"
            v-on:mouseout="unsetHoverList"
          />
        </transition-group>
      </ul>
    </div>

    <modal ref="modalAddList"
      v-bind:classNames="['modal_size_xsm']"
    >
      <form-add-list
        v-on:success="onSuccessFormAddList"
        v-on:cancel="closeModalAddList"
      ></form-add-list>
    </modal>

  </div>  
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

import ListItem from './ListItem.vue'
import FormAddList from './FormAddList.vue'

import Scrollable from '../js/scrollable'

export default {
  name: 'lists-view',
  components: {
    ListItem,
    FormAddList
  },
  data() {
    return {
      listMoving: {
        isStarted: false,
        movingListId: null,
        hoverListId: null
      },
      scrolling: {
        isActive: false
      }
    }
  },
  computed: {
    ...mapState([
      'lists'
    ]),
    ...mapGetters([
      'openedList'
    ])
  },
  methods: {
    openModalAddList() {
      this.$refs.modalAddList.open()
    },
    closeModalAddList() {
      this.$refs.modalAddList.close()
    },
    ...mapActions([
      'openList',
      'addList',
      'moveList'
    ]),
    listIsOpened(id) {
      return id === this.openedList.id
    },    
    initListeners() {
      document.addEventListener('mouseup', this.finishListMoving)

      this.$refs.topScrollTrigger.addEventListener('mouseover', this.startScrollUp)
      this.$refs.topScrollTrigger.addEventListener('mouseout', this.endScrollUp)

      this.$refs.bottomScrollTrigger.addEventListener('mouseover', this.startScrollDown)
      this.$refs.bottomScrollTrigger.addEventListener('mouseout', this.endScrollDown)

      this.scrollableLists = new Scrollable(this.$refs.lists)
      this.scrollableLists.initListener()
    },
    onSuccessFormAddList(name) {
      this.addList(name)
      this.closeModalAddList()
      this.$nextTick(this.scrollToLastList)
      this.$nextTick(this.animateNewList)
    },

    // List moving
    getListElement(id) {
      const listElements = Array.from(this.$refs.lists.querySelectorAll('li'))

      return listElements.find(list => list.dataset.id === id)
    },
    onStartListMoving(id) {
      this.listMoving.isStarted = true
      this.listMoving.movingListId = id
      this.setCursorGrubMode()
      this.activateScrollTriggers()
    },
    finishListMoving(event) {
      if (!this.listMoving.isStarted) return

      if (!this.listMoving.hoverListId) {
        this.unsetCursorGrubMode()
        this.unActivateScrollTriggers()
        this.resetListMoving()
        return
      }

      this.moveList({
        listId: this.listMoving.movingListId,
        targetListId: this.listMoving.hoverListId
      })
      this.removeHighLightHoverList()
      this.unsetCursorGrubMode()
      this.unActivateScrollTriggers()
      this.resetListMoving()
    },
    resetListMoving() {
      this.listMoving.isStarted = false
      this.listMoving.movingListId = null
      this.listMoving.hoverListId = null
    },
    setHoverList(id) {
      if (!this.listMoving.isStarted) return

      if (this.listMoving.movingListId === id) return

      this.listMoving.hoverListId = id
      this.$nextTick(this.addHighLightHoverList)
    },
    unsetHoverList() {
      if (!this.listMoving.isStarted) return
      if (!this.listMoving.hoverListId) return

      this.removeHighLightHoverList()
      this.$nextTick(() => {
        this.listMoving.hoverListId = null
      })
    },
    addHighLightHoverList() {
      const movingListIndex = this.lists.findIndex(list => list.id === this.listMoving.movingListId)
      const hoverListIndex = this.lists.findIndex(list => list.id === this.listMoving.hoverListId)
      const hoverListAboveMovingList = hoverListIndex < movingListIndex
      const hoverListElement = this.getListElement(this.listMoving.hoverListId)

      if (hoverListAboveMovingList) {
        hoverListElement.classList.add('list-item_pointer_top')
      } else {
        hoverListElement.classList.add('list-item_pointer_bottom')
      }
    },
    removeHighLightHoverList() {
      const hoverListElement = this.getListElement(this.listMoving.hoverListId)

      hoverListElement.classList.remove('list-item_pointer_top', 'list-item_pointer_bottom')
    },
    setCursorGrubMode() {
      document.body.classList.add('grabbing')
    },
    unsetCursorGrubMode() {
      document.body.classList.remove('grabbing')
    },
    scrollToLastList() {
      const listsCount = this.lists.length
      const lastListEl = Array.from(this.$refs.lists.children)[listsCount - 1]

      lastListEl.scrollIntoView({
        behavior: 'smooth'
      })
    },
    animateNewList() {
      const listsCount = this.lists.length
      const lastListEl = Array.from(this.$refs.lists.children)[listsCount - 1]

      lastListEl.classList.add('anim-add-item')
      lastListEl.addEventListener('animationend', removeAnimationClass)

      function removeAnimationClass() {
        lastListEl.classList.remove('anim-add-item')
        lastListEl.removeEventListener('animationend', removeAnimationClass)
      }
    },
    activateScrollTriggers() {
      this.$refs.topScrollTrigger.classList.add('lists-view__scroll-trigger_active')
      this.$refs.bottomScrollTrigger.classList.add('lists-view__scroll-trigger_active')
    },
    unActivateScrollTriggers() {
      this.$refs.topScrollTrigger.classList.remove('lists-view__scroll-trigger_active')
      this.$refs.bottomScrollTrigger.classList.remove('lists-view__scroll-trigger_active')
    },
    startScrollUp() {
      this.scrolling.isActive = true

      let curScrollPos = this.$refs.lists.scrollTop

      let timer = setInterval(() => {
        if (!this.scrolling.isActive || curScrollPos === 0) {
          clearInterval(timer)
          return
        }

        curScrollPos -= 1

        this.$refs.lists.scrollTo(0, curScrollPos)
      }, 5)
    },
    endScrollUp() {
      this.scrolling.isActive = false
    },
    startScrollDown() {
      this.scrolling.isActive = true

      let curScrollPos = this.$refs.lists.scrollTop
      const maxScrollPos = this.$refs.lists.scrollHeight - this.$refs.lists.clientHeight

      let timer = setInterval(() => {
        if (!this.scrolling.isActive || curScrollPos === maxScrollPos) {
          clearInterval(timer)
          return
        }

        curScrollPos += 1

        this.$refs.lists.scrollTo(0, curScrollPos)
      }, 5)
    },
    endScrollDown() {
      this.scrolling.isActive = false
    }
  },
  mounted() {
    this.initListeners()
  },
  beforeUnmount() {
    this.scrollableLists.removeListener()
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/env';

.lists-view {
  display: flex;
  flex-direction: column;
  justify-content: stretch;

  height: 100%;
  padding-top: 52px;

  position: relative;
}
.lists-view__header {
  height: 52px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  position: absolute;
  left: 0;
  top: 0;
}
.lists-view__body {
  position: relative;
}
.lists-view__ul {
  margin: 0;
  padding: 0;
}
.lists-view__scroll-trigger {
  width: 100%;
  height: 10px;
  display: none;
  position: absolute;  
  left: 50%;
  transform: translateX(-50%);
  background-color: $transparent;
  z-index: 10;
}
.lists-view__scroll-trigger_active {
  display: block;
}
.lists-view__scroll-trigger_top {
  top: 0;
}
.lists-view__scroll-trigger_bottom {
  bottom: 0;
}
.flip-list-move {
  transition: transform .3s ease;
}
</style>
