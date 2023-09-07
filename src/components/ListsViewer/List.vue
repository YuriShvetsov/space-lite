<template>
  <li
    class="list-item"
    :class="containerClasses"
  >
    <div class="list-item__pointer list-item__pointer_top"></div>
    <button
      class="list-item__button button"
      @click="onClickButton"
    >
      <Icon class="list-item__icon" :name="icon" />
      <span class="list-item__name">{{ name }}</span>
<!--      <span class="list-item__count">{{ countTodos }}</span>-->
    </button>
    <div class="list-item__pointer list-item__pointer_bottom"></div>
  </li>
</template>

<script setup>
import { computed } from 'vue'

import { useListsStore } from '@/stores/lists'
import { DEFAULT_LIST_ICON, LIST_ICONS } from '@/js/static/listIcons'

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: DEFAULT_LIST_ICON
  },
  opened: {
    type: Boolean,
    default: false
  }
})

const listsStore = useListsStore()

const containerClasses = computed(() => {
  return { 'list-item_active': props.opened }
})

// Handlers

const onClickButton = () => {
  if (props.opened) return
  listsStore.openList(props.id)
}

// export default {
//   name: 'list-item',
//   props: {
//     id: String,
//     name: String,
//     icon: {
//       type: String,
//       default: (value) => {
//         if (!value || !LIST_ICONS.includes(value)) {
//           return DEFAULT_LIST_ICON
//         }
//
//         return value
//       }
//     },
//     todos: Array,
//     isActive: {
//       type: Boolean,
//       default: false
//     }
//   },
//   data() {
//     return {
//       timerStartMoving: null
//     }
//   },
//   computed: {
//     ...mapGetters([
//       'lists',
//       'openedList',
//       'hiddenTodosVisible'
//     ]),
//     isOpened() {
//       return this.openedList.id === this.id
//     },
//     countTodos() {
//       const countAllTodos = this.todos.length
//       const countVisibleTodos = this.todos.filter(todo => !todo.hidden ).length
//       const count = this.hiddenTodosVisible ? countAllTodos : countVisibleTodos
//
//       if (count > 99) return '99+'
//
//       return count
//     }
//   },
//   methods: {
//     ...mapActions([
//       'openList'
//     ]),
//     openCurList() {
//       if (this.isOpened) return
//
//       this.openList(this.id)
//     },
//     handleMouseDown(e) {
//       const leftButton = (e.which === 1)
//
//       if (!leftButton) return
//
//       this.timerStartMoving = setTimeout(() => {
//         if (!this.isOpened) this.openList(this.id)
//
//         this.$emit('start-moving', this.id)
//         clearTimeout(this.timerStartMoving)
//       }, 500)
//     },
//     handleMouseUp(event) {
//       clearTimeout(this.timerStartMoving)
//     },
//     handleMouseOut(event) {
//       clearTimeout(this.timerStartMoving)
//     },
//     formatIconId(icon) {
//       return `#${ icon }`
//     }
//   }
// }
</script>

<style lang="scss" scoped>
@import '@/assets/scss/env';

.list-item {
  width: 100%;
  margin: 2px 0;
  position: relative;
  list-style: none;
}

.list-item_pointer_top .list-item__button:hover,
.list-item_pointer_bottom .list-item__button:hover {
  background-color: unset;
}

.list-item__pointer {
  width: calc(100% - 10px);
  height: 2px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  background-color: lighten($primaryColor, 10%);
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
  align-items: center;
  width: 100%;
  height: 32px;
  padding: 8px 12px 8px 32px;
  position: relative;

  line-height: 1.2em;
  color: get-light($baseTextColor);
}

.list-item__icon {
  width: 16px;
  height: 16px;
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  stroke: get-light($baseTextColor);
}

.list-item__name {
  max-width: calc(100% - 30px);
  text-overflow: ellipsis;
  overflow: hidden;
}

.list-item__count {
  color: get-light($secondaryTextColor);
}

.list-item_active .list-item__button {
  background-color: lighten($primaryColor, 34%);
  transition: none;
}

.list-item__name {
  margin-right: 10px;
}

@include dark-theme {

  .list-item__button {
    color: get-dark($baseTextColor);

    &:hover {
      background-color: darken(get-dark($bgColor, 'main'), 6%);
    }
  }

  .list-item__icon {
    stroke: get-dark($baseTextColor);
  }

  .list-item_pointer_top .list-item__button:hover,
  .list-item_pointer_bottom .list-item__button:hover {
    opacity: 1;
    background-color: unset;
  }

  .list-item_active .list-item__button {
    background-color: $primaryColor;

    &:hover { opacity: 1; }
  }

  .list-item__count {
    color: darken(get-dark($secondaryTextColor), 30%);
  }

  .list-item__pointer {
    background-color: lighten($primaryColor, 3%);
  }

}

</style>
