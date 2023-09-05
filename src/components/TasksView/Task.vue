<template>
  <li class="task" ref="task"
    :class="containerClasses"
  >

    <div class="task__hover-bg"></div>

    <div class="task__container">
      <div class="task__done">
        <input type="checkbox"
          class="task__done-checkbox"
          v-bind:id="id"
          v-bind:checked="done"
          v-on:change="emitChangeDone"
        >
        <label class="task__done-label"
          v-bind:for="id"
        >
          <Icon class="task__done-icon" name="check" />
        </label>
      </div>

      <div class="task__content">
        <div class="task__name">{{ name }}</div>
        <div class="task__notes">
          <pre class="task__notes-pre">{{ notes }}</pre>
        </div>
      </div>

      <div class="task__labels">
        <Icon v-show="hidden" class="task__hidden-status" name="eye-slash" />
        <Icon class="task__priority" :class="priorityClasses" name="flag" />
      </div>

      <button class="task__replace-button button button_type_icon button_type_grabber button_color_black"
        v-on:mousedown="emitStartMoving"
      >
        <span>Replace</span>
        <Icon class="button__icon button__icon_stroke" name="grabber" />
      </button>

      <popup ref="menu" class="task__menu">

        <template v-slot:opener>
          <button class="task__menu-button popup__opener button button_type_icon button_color_black"
            v-on:click="toggleMenu"
          >
            <span>Menu</span>
            <Icon class="button__icon button__icon_stroke" name="menu" />
          </button>
        </template>

        <template v-slot:content>
          <ul class="popup__action-list">
            <li class="popup__action">
              <button class="popup__action-button button button_type_popup button_color_black"
                v-on:click="openModalEditTask(), closeMenu()"
              >
                <span>Edit</span>
                <Icon class="button__icon button__icon_fill" name="edit" />
              </button>
            </li>
            <li class="popup__action">
              <button class="popup__action-button button button_type_popup button_color_black"
                v-on:click="emitDuplicate(), closeMenu()"
              >
                <span>Duplicate</span>
                <Icon class="button__icon button__icon_fill" name="duplicate" />
              </button>
            </li>
            <li class="popup__action">
              <button class="popup__action-button button button_type_popup button_color_black"
                v-on:click="emitHideShow(), closeMenu()"
              >
                <span>{{ toggleVisibilityText }}</span>
                <Icon class="button__icon button__icon_fill" :name="toggleVisibilityIcon" />
              </button>
            </li>
            <div class="popup__devider"></div>
            <li class="popup__action">
              <button class="popup__action-button button button_type_popup button_color_red"
                v-on:click="emitRemove(), closeMenu()"
              >
                <span>Delete</span>
                <Icon class="button__icon button__icon_stroke" name="delete" />
              </button>
            </li>
          </ul>
        </template>

      </popup>

    </div>

    <div class="pointer pointer_pos_top js-top-pointer"></div>
    <div class="pointer pointer_pos_bottom js-bottom-pointer"></div>

    <div class="task__outer">
      <modal ref="modalEditTask"
        v-bind:classNames="['modal_size_sm']"
      >
        <form-edit-task
          v-bind="dataForEditing"
          v-on:success="onSuccessFormEditTask"
          v-on:cancel="closeModalEditTask"
        ></form-edit-task>
      </modal>
    </div>

  </li>
</template>

<script>
import FormEditTask from './FormEditTask.vue'

export default {
  name: 'task',
  components: {
    FormEditTask
  },
  emits: ['change-done', 'update', 'remove', 'start-moving', 'duplicate'],
  props: {
    id: {
      type: String,
      default: Date.now().toString()
    },
    done: {
      type: Boolean,
      default: false
    },
    hidden: {
      type: Boolean,
      default: false
    },
    priority: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: 'Default name'
    },
    notes: {
      type: String,
      default: ''
    }
  },
  computed: {
    dataForEditing() {
      return {
        name: this.name,
        notes: this.notes,
        priority: this.priority
      }
    },
    priorityClasses() {
      if (!this.priority) return ''

      return `task__priority_visible task__priority_${ this.priority.toLowerCase() }`
    },
    containerClasses() {
      return { 'task_completed': this.done }
    },
    toggleVisibilityText() {
      return this.hidden ? 'Show' : 'Hide'
    },
    toggleVisibilityIcon() {
      return this.hidden ? '#eye' : '#eye-slash'
    }
  },
  methods: {
    // Modals
    openModalEditTask() {
      this.$refs.modalEditTask.open()
    },
    closeModalEditTask() {
      this.$refs.modalEditTask.close()
    },

    // Popups
    toggleMenu() {
      this.$refs.menu.toggle()
    },
    closeMenu() {
      this.$refs.menu.close()
    },

    onSuccessFormEditTask(data) {
      this.emitUpdate(data)
      this.closeModalEditTask()
    },

    emitChangeDone() {
      this.$emit('change-done', this.id)
    },
    emitUpdate({ name, notes, priority }) {
      this.$emit('update', {
        id: this.id,
        name,
        notes,
        priority
      })
    },
    emitDuplicate() {
      this.$emit('duplicate', this.id)
    },
    emitHideShow() {
      if (this.hidden) {
        this.$emit('show', this.id)
      } else {
        this.$emit('hide', this.id)
      }
    },
    emitRemove() {
      this.$emit('remove', this.id)
    },
    emitStartMoving(e) {
      const leftButton = (e.which === 1)

      if (!leftButton) return

      this.$emit('start-moving', this.id)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/env';

.task {
  margin: 2px 0;
  position: relative;
  list-style: none;
  background-color: $transparent;
  border-radius: 5px;
  transition: background-color .15s ease-in-out;
}

.task_selected {
  background-color: lighten($primaryColor, 34%);
}

.task_signal {
  animation-fill-mode: both;
  animation: signal 2s ease-in-out;
}

.task__container {
  position: relative;
}

.task__hover-bg {
  display: block;
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  transform: scaleX(0.4);

  background-image: get-light($taskHoverBg);
  border-radius: 5px;
  opacity: 0;

  pointer-events: none;
  transition: opacity .15s ease-in-out, transform .35s ease-in-out, background-image 200ms ease;
}

.task:hover .task__hover-bg {
  transform: scaleX(1);
  opacity: 1;
}

.task_selected:hover .task__hover-bg {
  opacity: 0;
}

.task_pointer:hover .task__hover-bg {
  opacity: 0;
}

.task__container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 12px;
}

.task__done {
  margin-right: 12px;
}

.task__done-checkbox {
  display: none;
}

.task__done-label {
  display: block;
  width: 18px;
  height: 18px;

  cursor: pointer;
  z-index: get-layer('page');
}

.task__done-icon {
  display: block;
  width: 18px;
  height: 18px;
  fill: none;
  stroke: $gray;
}

.task__done-checkbox:checked + .task__done-label .task__done-icon {
  stroke: $green;
}

.task__content {
  width: 100%;
  margin-right: 6px;
  padding: 0 2px;
  transition: opacity .15s ease-out;
}

.task_completed .task__content {
  opacity: 0.5;
}

.task__name {
  font-size: 13px;
  font-weight: bold;
  color: get-light($baseTextColor);
  word-break: break-word;
}

.task__notes-pre {
  margin: 0;
  font-family: $fontMain;
  font-size: 12px;
  color: get-light($secondaryTextColor);
  white-space: pre-wrap;
  word-break: break-word;
}

.task__labels {
  display: flex;
  align-items: center;
  position: absolute;
  right: 18px;
  top: 50%;
  transform: translate(0, -50%);
  transition: opacity .15s ease, transform .15s ease;
}

.task:not(.task_pointer, .task_selected):hover .task__labels {
  transform: translate(18px, -50%);
  opacity: 0;
}

.task__hidden-status {
  display: block;
  width: 16px;
  height: 16px;

  opacity: .4;
  pointer-events: none;
}

.task__priority {
  display: none;
  width: 14px;
  height: 14px;
  margin-left: 8px;

  &_visible { display: block; }

  &_low {
    fill: get-light($taskPriorityBgColor, 'low');
  }

  &_middle {
    fill: get-light($taskPriorityBgColor, 'middle');
  }

  &_high {
    fill: get-light($taskPriorityBgColor, 'high');
  }
}

.task_completed .task__priority {
  opacity: .5;
}

.task__replace-button,
.task__menu-button {
  opacity: 0;
  pointer-events: none;
  transform: translateX(-20px);
  transition: opacity .15s ease-in-out, transform .15s ease-in-out;
}

.task__menu {
  z-index: inherit;
}

.task:hover .task__replace-button,
.task:hover .task__menu-button {
  pointer-events: all;
  opacity: 1;
  transform: translateX(0);
}

.task_selected:hover .task__replace-button,
.task_selected:hover .task__menu-button,
.task_pointer:hover .task__replace-button,
.task_pointer:hover .task__menu-button {
  opacity: 0;
}

.pointer {
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

.pointer_visible {
  opacity: 1;
  transition: opacity .15s ease-in-out;
}

.pointer_pos_top {
  bottom: 100%;
}

.pointer_pos_bottom {
  top: 100%;
}

.task__outer {
  position: absolute;
  right: 0;
  bottom: 100%;
}

@include dark-theme {

  .task_selected {
    background-color: $primaryColor;
  }

  .task__hover-bg {
    background-image: map-get($taskHoverBg, 'dark');
  }

   .task__content_half-hidden {
      opacity: 0.6;
    }

  .task__name {
    color: get-dark($baseTextColor);
  }

  .task__notes-pre {
    color: get-dark($secondaryTextColor);
  }

  .task__hidden-status {
    fill: #fff;
    opacity: .6;
  }

  .pointer {
    background-color: lighten($primaryColor, 3%);
  }

}

</style>
