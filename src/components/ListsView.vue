<template>
  <div class="lists-view">

    <div class="lists-view__header">
      <div class="lists-view__title title title_size_s">My lists</div>
      <button class="lists-view__add-button button button_type_text-icon button_icon_add"
        v-on:click="openModalAddList"
      >Add list</button>
    </div>

    <div class="lists-view__body scrollable-wrapper">
      <ul class="lists-view__ul scrollable-child"
        ref="lists"
      >
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
      </ul>
    </div>

    <modal ref="modalAddList">
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
    },
    finishListMoving(event) {
      if (!this.listMoving.isStarted) return

      if (!this.listMoving.hoverListId) {
        this.unsetCursorGrubMode()
        this.resetListMoving()
        return
      }

      this.moveList({
        listId: this.listMoving.movingListId,
        targetListId: this.listMoving.hoverListId
      })
      this.removeHighLightHoverList()
      this.unsetCursorGrubMode()
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
    }
  },
  mounted() {
    this.initListeners()
  }
}
</script>

<style scoped>
.lists-view {
  display: flex;
  flex-direction: column;
  justify-content: stretch;

  height: 100%;
  padding-top: 51px;

  position: relative;
}

.lists-view__header {
  height: 51px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  position: absolute;
  left: 0;
  top: 0;
}

.lists-view__ul {
  margin: 0;
  padding: 0;
}
</style>
