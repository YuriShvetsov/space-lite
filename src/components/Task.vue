<template>
  <li class="task" ref="task">

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
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="#cccccc">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </label>
      </div>

      <div class="task__content" v-bind:class="{ 'task__content_half-hidden': done }">
        <div class="task__name">{{ name }}</div>
        <div class="task__notes">
          <pre class="task__notes-pre">{{ notes }}</pre>
        </div>
        <div class="task__priority"
          v-bind:class="prioriyClassName"
        >{{ priority }}</div>
      </div>

      <button class="task__replace-button button button_type_icon button_icon_grabber"
        v-on:mousedown="emitStartMoving"
      >Replace</button>

      <popup ref="menu" class="task__menu">

        <template v-slot:opener>
          <button class="task__menu-button popup__opener button button_type_icon button_icon_menu"
            v-on:click="toggleMenu"
          >menu</button>
        </template>

        <template v-slot:content>
          <ul class="popup__action-list">
            <li class="popup__action">
              <button class="popup__action-button button button_type_popup button_icon_edit"
                v-on:click="openModalEditTask(), closeMenu()"
              >Edit</button>
            </li>
            <li class="popup__action">
              <button class="popup__action-button button button_type_popup button_icon_copy"
                v-on:click="emitDuplicate(), closeMenu()"
              >Duplicate</button>
            </li>
            <li class="popup__action">
              <button class="popup__action-button button button_type_popup button_icon_delete button_color_red"
                v-on:click="emitRemove(), closeMenu()"
              >Delete</button>
            </li>
          </ul>
        </template>

      </popup>

    </div>

    <div class="pointer pointer_pos_top js-top-pointer"></div>
    <div class="pointer pointer_pos_bottom js-bottom-pointer"></div>

    <div class="task__outer">
      <modal ref="modalEditTask">
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
    prioriyClassName() {
      if (this.priority === '') return

      return `task__priority_visible task__priority_${ this.priority.toLowerCase() }`
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
@import '../assets/scss/utils/vars.scss';

.task {
  margin: 2px 0;
  position: relative;
  list-style: none;
  background-color: rgba(255, 255, 255, 0);
  border-radius: 5px;
  user-select: none;
  transition: background-color .15s ease-in-out;
}

.task_selected {
  background-color: lighten($colorViolet, 34%);
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

  background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.02), rgba(0, 0, 0, 0.025));
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
  z-index: map-get($zLayers, "zIndexPage");
}

.task__done-checkbox:checked + .task__done-label svg {
  stroke: $colorGreenCold;
}

.task__content {
  width: 100%;
  margin-right: 12px;
  padding: 0 2px;
  transition: opacity .15s ease-out;
}

.task__content_half-hidden {
  opacity: 0.5;
}

.task__name {
  font-size: 14px;
  font-weight: bold;
  color: $colorBlack;
  word-break: break-all;
}

.task__notes-pre {
  margin: 0;
  font-family: $font_main;
  font-size: 13px;
  color: $colorGray;
  white-space: pre-wrap;
  word-break: break-word;
}

.task__priority {
  display: none;
  margin-top: 5px;
  padding: 2px 7px;
  font-size: 10px;
  text-transform: uppercase;
  border-radius: 3px;
  box-shadow: inset 0 0 5px rgba(0,0,0,0.02);
}

.task__priority_visible {
  display: inline-block;
}

.task__priority_low {
  color: lighten($colorGreenCold, 10%);
  background-color: lighten($colorGreenCold, 48%);
}

.task__priority_middle {
  color: lighten($colorBlue, 10%);
  background-color: lighten($colorBlue, 40%);
}

.task__priority_high {
  color: lighten($colorRed, 10%);
  background-color: lighten($colorRed, 40%);
}

.task__replace-button,
.task__menu-button {
  opacity: 0;
  pointer-events: none;
  transition: opacity .15s ease-in-out;
}

.task__menu {
  z-index: inherit;
}

.task:hover .task__replace-button,
.task:hover .task__menu-button {
  pointer-events: all;
  opacity: 1;
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

  background-color: lighten($colorViolet, 10%);
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
</style>
