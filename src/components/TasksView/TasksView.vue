<template>
  <div class="tasks-view" v-if="dataIsValid">

    <div class="tasks-view__header">

      <div class="tasks-view__title title title_size_m" :title="name">
        <svg class="tasks-view__icon">
          <use :xlink:href="formattedIcon"></use>
        </svg>
        <span>{{ name }}</span>
      </div>

      <div class="tasks-view__controls">

        <button class="button button_type_icon-text button_color_red"
          :class="{ 'button_type_disabled': !hasCompletedTodos }"
          :disabled="!hasCompletedTodos"
          @click="removeCompletedTodos(id)"
        >
          <span>Clear</span>
          <svg class="button__icon button__icon_stroke">
            <use xlink:href="#backspace"></use>
          </svg>
        </button>

        <button class="button button_type_icon-text button_fill_violet"
          @click="openTaskEditor"
        >
          <span>Task</span>
          <svg class="button__icon button__icon_stroke">
            <use xlink:href="#plus"></use>
          </svg>
        </button>

        <popup ref="menu">

          <template v-slot:opener>
            <button class="popup__opener button button_type_icon button_color_black"
              @click="toggleMenu"
            >
              <span>Menu</span>
              <svg class="button__icon button__icon_stroke">
                <use xlink:href="#menu"></use>
              </svg>
            </button>
          </template>

          <template v-slot:content>
            <ul class="popup__action-list">
              <li class="popup__action">
                <button class="popup__action-button button button_type_popup button_color_black"
                  @click="openModalRenameList(), closeMenu()"
                >
                  <span>Rename</span>
                  <svg class="button__icon button__icon_fill">
                    <use xlink:href="#edit"></use>
                  </svg>
                </button>
              </li>
              <li class="popup__action">
                <button class="popup__action-button button button_type_popup button_color_black"
                  @click="openModalImportTodos(), closeMenu()"
                >
                  <span>Import</span>
                  <svg class="button__icon button__icon_stroke">
                    <use xlink:href="#upload"></use>
                  </svg>
                </button>
              </li>
              <li v-if="hasTodos" class="popup__action">
                <button class="popup__action-button button button_type_popup button_color_red"
                  @click="openModalDeleteTasks(), closeMenu()"
                >
                  <span>Delete all tasks</span>
                  <svg class="button__icon button__icon_fill">
                    <use xlink:href="#list-alternative"></use>
                  </svg>
                </button>
              </li>
              <li class="popup__action">
                <button class="popup__action-button button button_type_popup button_color_red"
                  @click="openModalDeleteList(), closeMenu()"
                >
                  <span>Delete{{ hasTodos ? ' list' : '' }}</span>
                  <svg class="button__icon button__icon_stroke">
                    <use xlink:href="#delete"></use>
                  </svg>
                </button>
              </li>
            </ul>
          </template>

        </popup>

      </div>

    </div>

    <div class="tasks-view__body scrollable-wrapper">

      <div class="scroll-trigger scroll-trigger_up"
        ref="scrollUpTrigger"
      ></div>

      <div class="scroll-trigger scroll-trigger_down"
        ref="scrollDownTrigger"
      ></div>

      <ul class="tasks-view__ul scrollable-child" ref="content" >
        <transition-group :name="todosAnimationName" :css="false">
          <task
            class="js-task"
            v-for="todo in todos"
            :key="todo.id"
            :data-id="todo.id"
            v-bind="todo"
            @:change-done="onChangeDoneTodo"
            @:update="onUpdateTodo"
            @:start-moving="onStartTaskMoving"
            @:duplicate="onDuplicateTodo"
            @:hide="onHideTodo"
            @:show="onShowTodo"
            @:remove="onRemoveTodo"
          ></task>
        </transition-group>
      </ul>

      <div class="tasks-view__no-tasks" v-show="isEmpty">
        <div class="icon">
          <svg class="icon__document">
            <use xlink:href="#document-large"></use>
          </svg>
          <svg class="icon__pencil">
            <use xlink:href="#pencil-large"></use>
          </svg>
        </div>
        <span class="text">No tasks yet :(</span>
      </div>

    </div>

    <div class="tasks-view__outer">

      <!-- <task-editor ref="taskEditor" mode="add" /> -->

      <modal
        class="modal_size_xsm"
        ref="modalRenameList"
      >
        <form-rename-list
          :name="name"
          :icon="icon"
          @:success="onSuccessFormRenameList"
          @:cancel="closeModalRenameList"
        ></form-rename-list>
      </modal>

      <modal
        class="modal_size_lg"
        ref="modalImportTodos"
      >
        <form-import-todos
          @:success="onSuccessFormImportTodos"
          @:cancel="closeModalImportTodos"
        >  
        </form-import-todos>
      </modal>

      <modal ref="modalDeleteTasks">
        <form-delete-tasks
          @:success="onSuccessFormDeleteTasks"
          @:cancel="closeModalDeleteTasks"
        ></form-delete-tasks>
      </modal>

      <modal ref="modalDeleteList">
        <form-delete-list
          @:success="onSuccessFormDeleteList"
          @:cancel="closeModalDeleteList"
        ></form-delete-list>
      </modal>

    </div>

  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import Task from './Task.vue'
import TaskEditor from '@/components/TaskEditor/TaskEditor.vue'
import FormEditTask from './FormEditTask.vue'
import FormRenameList from './FormRenameList.vue'
import FormImportTodos from './FormImportTodos.vue'
import FormDeleteTasks from './FormDeleteTasks.vue'
import FormDeleteList from './FormDeleteList.vue'

import Scrollable from '@/js/scrollable'

export default {
  name: 'tasks-view',
  components: {
    Task,
    TaskEditor,
    FormEditTask,
    FormRenameList,
    FormImportTodos,
    FormDeleteTasks,
    FormDeleteList
  },
  data() {
    return {
      taskMoving: {
        isStarted: false,
        movingTaskId: null,
        hoverTaskId: null
      },
      scrolling: {
        isActive: false
      },
      todosAnimationName: 'flip-list'
    }
  },
  computed: {
    ...mapGetters([
      'openedList',
      'hiddenTodosVisible'
    ]),
    id() {
      return this.openedList.id
    },
    name() {
      return this.openedList.name
    },
    icon() {
      return this.openedList.icon
    },
    formattedIcon() {
      return `#${ this.icon }`
    },
    todos() {
      const modifiedTodos = this.openedList.todos.map(todo => ({
        listId: this.openedList.id,
        ...todo
      }))

      if (this.hiddenTodosVisible) return modifiedTodos

      return modifiedTodos.filter(todo => !todo.hidden)
    },
    isEmpty() {
      return !this.todos.length
    },
    dataIsValid() {
      return (
        this.id &&
        this.name &&
        this.todos
      )
    },
    hasTodos() {
      return !!this.todos.length
    },
    hasCompletedTodos() {
      return this.todos.find(todo => todo.done)
    }
  },
  watch: {
    hiddenTodosVisible() {
      this.disableTodosAnimation()
      this.enableTodosAnimation()
    }
  },
  methods: {
    ...mapActions([
      'updateListName',
      'removeCompletedTodos',
      'removeTodos',
      'removeList',
      'addTodo',
      'importTodos',
      'autoImportTodos',
      'toggleTodo',
      'updateTodo',
      'removeTodo',
      'moveTodo',
      'duplicateTodo',
      'hideTodo',
      'showTodo'
    ]),
    // openModalAddTask() {
    //   this.$refs.modalAddTask.open()
    // },
    // closeModalAddTask() {
      //   this.$refs.modalAddTask.close()
      // },
    openTaskEditor() {
      this.$refs.taskEditor.open()
    },
    closeTaskEditor() {
      this.$refs.taskEditor.close()
    },
    openModalRenameList() {
      this.$refs.modalRenameList.open()
    },
    closeModalRenameList() {
      this.$refs.modalRenameList.close()
    },
    openModalImportTodos() {
      this.$refs.modalImportTodos.open()
    },
    closeModalImportTodos() {
      this.$refs.modalImportTodos.close()
    },
    openModalDeleteTasks() {
      this.$refs.modalDeleteTasks.open()
    },
    closeModalDeleteTasks() {
      this.$refs.modalDeleteTasks.close()
    },
    openModalDeleteList() {
      this.$refs.modalDeleteList.open()
    },
    closeModalDeleteList() {
      this.$refs.modalDeleteList.close()
    },

    onChangeDoneTodo(id) {
      this.toggleTodo({
        listId: this.id,
        todoId: id
      })
    },
    onUpdateTodo({ id, name, notes, priority }) {
      this.updateTodo({
        listId: this.id,
        todoId: id,
        name,
        notes,
        priority
      })
    },
    onDuplicateTodo(id) {
      this.duplicateTodo({
        listId: this.id,
        todoId: id
      })

      this.$nextTick(() => {
        const copyTodoIndex = this.todos.findIndex(todo => todo.id === id) + 1
        const taskCopy = this.getTaskElements()[copyTodoIndex]

        taskCopy.classList.add('anim-duplicate-task')
        taskCopy.addEventListener('animationend', e => {
          e.target.classList.remove('anim-duplicate-task')
        }, { once: true })
      })
    },
    onHideTodo(id) {
      this.hideTodo({ listId: this.id, todoId: id })
    },
    onShowTodo(id) {
      this.showTodo({ listId: this.id, todoId: id })
    },
    onRemoveTodo(id) {
      this.removeTodo({
        listId: this.id,
        todoId: id
      })
    },

    onSuccessFormAddTask({ name, notes, priority }) {
      this.addTodo({
        id: this.id,
        name,
        notes,
        priority
      })
      this.closeModalAddTask()
      this.$nextTick(this.scrollToLastTask)
    },
    onSuccessFormRenameList({ name, icon }) {
      this.updateListName({
        id: this.id,
        name,
        icon
      })
      this.closeModalRenameList()
    },
    onSuccessFormImportTodos(todos, isAuto) {
      if (isAuto) {
        this.autoImportTodos(todos)
      } else {
        this.importTodos({ listId: this.id, todos })
      }

      this.closeModalImportTodos()
    },
    onSuccessFormDeleteTasks() {
      const listId = this.id
      const todosIds = this.todos.map(todo => todo.id)

      this.removeTodos({ listId, todosIds })
      this.closeModalDeleteTasks()
    },
    onSuccessFormDeleteList() {
      this.removeList(this.id)
      this.closeModalDeleteList()
    },

    toggleMenu() {
      this.$refs.menu.toggle()
    },
    closeMenu() {
      this.$refs.menu.close()
    },

    enableTodosAnimation() {
      setTimeout(() => {
        this.todosAnimationName = 'flip-list'
      })
    },
    disableTodosAnimation() {
      this.todosAnimationName = 'none'
    },

    getTaskElements() {
      return Array.from(this.$refs.content.querySelectorAll('.js-task'))
    },
    getTaskElement(id) {
      const taskElements = this.getTaskElements()

      return taskElements.find(t => t.dataset.id === id)
    },
    scrollToLastTask() {
      const taskElements = this.getTaskElements();
      const lastTaskElement = taskElements[taskElements.length - 1]

      // Scrolling to last task
      lastTaskElement.scrollIntoView({
        behavior: 'smooth'
      })

      // Display of task animation
      lastTaskElement.classList.add('anim-add-item')
      lastTaskElement.addEventListener('animationend', e => {
        e.target.classList.remove('anim-add-item')
      });
    },
    selectMovingTask() {
      const movingTask = this.getTaskElement(this.taskMoving.movingTaskId)

      movingTask.classList.add('task_selected')
      document.body.classList.add('grabbing')
    },
    unSelectMovingTask() {
      const movingTask = this.getTaskElement(this.taskMoving.movingTaskId)

      movingTask.classList.remove('task_selected')
      document.body.classList.remove('grabbing')
    },
    showPointerOnHoverTask() {
      const hoverTask = this.getTaskElement(this.taskMoving.hoverTaskId)

      hoverTask.classList.add('task_pointer')

      const pointerClassName = hoverTaskIsAbove.call(this) ? '.js-top-pointer' : '.js-bottom-pointer'
      const pointer = hoverTask.querySelector(pointerClassName)

      pointer.classList.add('pointer_visible')

      function hoverTaskIsAbove() {
        const hoverTaskIndex = this.todos.findIndex(t => t.id === this.taskMoving.hoverTaskId)
        const movingTaskIndex = this.todos.findIndex(t => t.id === this.taskMoving.movingTaskId)

        return movingTaskIndex > hoverTaskIndex
      }
    },
    hidePointerOnHoverTask() {
      const hoverTask = this.getTaskElement(this.taskMoving.hoverTaskId)
      const topPointer = hoverTask.querySelector('.js-top-pointer')
      const bottomPointer = hoverTask.querySelector('.js-bottom-pointer')

      topPointer.classList.remove('pointer_visible')
      bottomPointer.classList.remove('pointer_visible')

      hoverTask.classList.remove('task_pointer')
    },
    activateScrollTriggers() {
      this.$refs.scrollUpTrigger.classList.add('scroll-trigger_active')
      this.$refs.scrollDownTrigger.classList.add('scroll-trigger_active')
    },
    unActivateScrollTriggers() {
      this.$refs.scrollUpTrigger.classList.remove('scroll-trigger_active')
      this.$refs.scrollDownTrigger.classList.remove('scroll-trigger_active')
    },
    
    initListeners() {
      document.addEventListener('mouseover', this.continueTaskMoving)
      document.addEventListener('mouseup', this.finishTaskMoving)

      this.$refs.scrollUpTrigger.addEventListener('mouseover', this.startScrollUp)
      this.$refs.scrollUpTrigger.addEventListener('mouseout', this.endScrollUp)

      this.$refs.scrollDownTrigger.addEventListener('mouseover', this.startScrollDown)
      this.$refs.scrollDownTrigger.addEventListener('mouseout', this.endScrollDown)

      this.scrollableContent = new Scrollable(this.$refs.content)
      this.scrollableContent.initListener()
    },
    onStartTaskMoving(id) {
      this.taskMoving.isStarted = true
      this.taskMoving.movingTaskId = id

      this.selectMovingTask()
      this.activateScrollTriggers()
    },
    continueTaskMoving(e) {
      if (!this.taskMoving.isStarted) return

      const task = e.target.closest('.js-task')
      const movingTaskId = this.taskMoving.movingTaskId
      const hoverTaskId = this.taskMoving.hoverTaskId

      if (!task && hoverTaskId) {
        this.hidePointerOnHoverTask()
        this.taskMoving.hoverTaskId = null

        return
      }

      if (!task && !hoverTaskId) {
        return
      }

      const newTaskId = task.dataset.id

      if (newTaskId === movingTaskId && hoverTaskId) {
        this.hidePointerOnHoverTask()
        this.taskMoving.hoverTaskId = null

        return
      }

      if (newTaskId === movingTaskId && !hoverTaskId) {
        return
      }

      if (hoverTaskId && newTaskId !== hoverTaskId) {
        this.hidePointerOnHoverTask()
        this.taskMoving.hoverTaskId = newTaskId;
        this.showPointerOnHoverTask()

        return
      }

      if (hoverTaskId && newTaskId === hoverTaskId) {
        return
      }

      if (!hoverTaskId) {
        this.taskMoving.hoverTaskId = newTaskId
        this.showPointerOnHoverTask()
        
        return
      }
    },
    finishTaskMoving() {
      if (!this.taskMoving.isStarted) return

      if (this.taskMoving.hoverTaskId) {
        this.moveTodo({
          listId: this.id,
          todoId: this.taskMoving.movingTaskId,
          targetTodoId: this.taskMoving.hoverTaskId
        })
        this.hidePointerOnHoverTask()
      }

      this.unSelectMovingTask()
      this.unActivateScrollTriggers()
      this.cancelTaskMoving()
    },
    cancelTaskMoving() {
      this.taskMoving.isStarted = false
      this.taskMoving.movingTaskId = null
      this.taskMoving.hoverTaskId = null
    },

    startScrollUp() {
      this.scrolling.isActive = true

      let curScrollPos = this.$refs.content.scrollTop

      let timer = setInterval(() => {
        if (!this.scrolling.isActive || curScrollPos === 0) {
          clearInterval(timer)
          return
        }

        curScrollPos -= 1

        this.$refs.content.scrollTo(0, curScrollPos)
      }, 5);
    },
    endScrollUp() {
      this.scrolling.isActive = false
    },
    startScrollDown() {
      this.scrolling.isActive = true

      const maxScrollPos = this.$refs.content.scrollHeight - this.$refs.content.clientHeight
      let curScrollPos = this.$refs.content.scrollTop

      let timer = setInterval(() => {
        if (!this.scrolling.isActive || curScrollPos === maxScrollPos) {
          clearInterval(timer)
          return
        }

        curScrollPos += 1

        this.$refs.content.scrollTo(0, curScrollPos)
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
    this.scrollableContent.removeListener()
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/env';

.tasks-view {
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  height: 100%;
}

.tasks-view__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0 12px;
}

.tasks-view__title {
  max-width: calc(100% - 40px);
  padding-left: 26px;
  position: relative;

  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.tasks-view__icon {
  width: 18px;
  height: 18px;
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  stroke: get-light($baseTextColor);
}

.tasks-view__controls {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-left: 6px;
}

.tasks-view__body {
  display: flex;
  flex-direction: column;
  justify-content: stretch;

  height: 100%;

  position: relative;
}

.tasks-view__no-tasks {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  opacity: .4;
  user-select: none;

  & .icon {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 8px;
    padding-right: 10px;
    position: relative;
    fill: rgba(255, 255, 255, 0);
    stroke:  #000;

    &__document {
      width: 64px;
      height: 64px;
    }

    &__pencil {
      width: 32px;
      height: 32px;
      position: absolute;
      top: calc(50% + 18px);
      right: 6px;
      transform: rotate(-45deg) translate(100%, -50%);
    }
  }

  & .text {
    font-size: 12px;
    font-weight: bold;
  }
}

.scroll-trigger {
  display: none;

  width: 100%;
  height: 10px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);

  background-color: $transparent;

  z-index: get-layer('page');
}

.scroll-trigger_active {
  display: block;
}

.scroll-trigger_up {
  top: 0;
}

.scroll-trigger_down {
  bottom: 0;
}

.tasks-view__ul {
  width: 100%;
  margin: 0;
  padding: 0;
}
.flip-list-move {
  transition: transform .3s ease;
}

// Dark theme

.app_theme_dark {

  .tasks-view__icon {
    stroke: #ffffff;
  }

  .tasks-view__no-tasks .icon {
    stroke: #fff;
  }

}
</style>
