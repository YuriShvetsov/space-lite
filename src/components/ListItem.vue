<template>
  <li class="list-item"
    v-bind:class="{ 'list-item_active': isActive }"
  >
    <div class="list-item__pointer list-item__pointer_top"></div>
    <button class="list-item__button button"
      v-on:click="openCurList"
      v-on:mousedown="handleMouseDown"
      v-on:mouseup="handleMouseUp"
      v-on:mouseout="handleMouseOut"
    >
      <div class="list-item__name">{{ name }}</div>
      <div class="list-item__count">{{ todos.length }}</div>
    </button>
    <div class="list-item__pointer list-item__pointer_bottom"></div>
  </li>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'list-item',
  props: {
    id: String,
    name: String,
    todos: Array,
    isActive: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      timerStartMoving: null
    }
  },
  computed: {
    ...mapGetters([
      'openedList'
    ]),
    isOpened() {
      return this.openedList.id === this.id
    }
  },
  methods: {
    ...mapActions([
      'openList'
    ]),
    openCurList() {
      if (this.isOpened) return

      this.openList(this.id)
    },
    handleMouseDown(event) {
      this.timerStartMoving = setTimeout(() => {
        if (!this.isOpened) this.openList(this.id)

        this.$emit('start-moving', this.id)
        clearTimeout(this.timerStartMoving)
      }, 500)
    },
    handleMouseUp(event) {
      clearTimeout(this.timerStartMoving)
    },
    handleMouseOut(event) {
      clearTimeout(this.timerStartMoving)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/utils/vars.scss';

.list-item {
  position: relative;
  width: 100%;
  list-style: none;
}
.list-item_pointer_top .list-item__button:hover,
.list-item_pointer_bottom .list-item__button:hover {
  background: unset;
}
.list-item__pointer {
  width: calc(100% - 10px);
  height: 2px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  background-color: lighten($colorViolet, 10%);
  border-radius: 2px;
  opacity: 0;
  pointer-events: none;
}
.list-item__pointer_top {
  top: 0;
}
.list-item__pointer_bottom {
  bottom: 0;
}
.list-item_pointer_top .list-item__pointer_top {
  opacity: 1;
  transition: opacity .15s ease-in-out;
}
.list-item_pointer_bottom .list-item__pointer_bottom {
  opacity: 1;
  transition: opacity .15s ease-in-out;
}
.list-item__button {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 9px 12px;
  color: $colorBlack;
}
.list-item__name {
  text-transform: lowercase;
}
.list-item__name::first-letter {
  text-transform: uppercase;
}
.list-item__count {
  color: $colorGray;
}
.list-item_active .list-item__button {
  background-color: $colorVioletLightest;
}
.list-item__name {
  margin-right: 10px;
}
</style>
