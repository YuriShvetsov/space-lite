<template>
  <li class="task" ref="task" :class="containerClasses">

    <div class="task__controls">

      <div class="task__controls-col">
        <div class="task__done" @mousedown.stop >
          <input
            type="checkbox"
            class="task__done-checkbox"
            :id="id"
            :checked="done"
            @change="toggleTaskDone"
          >
          <label class="task__done-label" :for="id">
            <Icon class="task__done-icon" name="check" />
          </label>
        </div>

        <div class="task__name">{{ name }}</div>
      </div>

      <div class="task__controls-col">
        <div class="task__tags" @mousedown.stop ></div>

        <div v-show="priority" class="task__priority" :class="priorityClasses">
          <Icon class="task__priority-icon" :name="PRIORITY_ICONS[priority]" />
          <span>{{ priority }}</span>
        </div>

        <Popup class="task__menu" ref="menuRef" @mousedown.stop >

          <template v-slot:opener>
            <button
              class="task__menu-button popup__opener button button_type_icon button_color_black"
              @click="toggleMenu"
            >
              <span>Menu</span>
              <Icon class="button__icon button__icon_stroke" name="menu" />
            </button>
          </template>

          <template v-slot:content>
            <ul class="popup__action-list">
              <li class="popup__action">
                <button class="popup__action-button button button_type_popup button_color_black"
                  @click="openModalEditTask(), closeMenu()"
                >
                  <span>Edit</span>
                  <Icon class="button__icon button__icon_fill" name="edit" />
                </button>
              </li>
              <li class="popup__action">
                <button class="popup__action-button button button_type_popup button_color_black"
                  @click="duplicateTask(), closeMenu()"
                >
                  <span>Duplicate</span>
                  <Icon class="button__icon button__icon_fill" name="document-duplicate" />
                </button>
              </li>
              <li class="popup__action">
                <button class="popup__action-button button button_type_popup button_color_black"
                  @click="toggleTaskVisibility(), closeMenu()"
                >
                  <span>{{ hideTaskBtnText }}</span>
                  <Icon class="button__icon button__icon_fill" :name="hideTaskBtnIcon" />
                </button>
              </li>
              <div class="popup__divider"></div>
              <li class="popup__action">
                <button class="popup__action-button button button_type_popup button_color_red"
                  @click="removeTask(), closeMenu()"
                >
                  <span>Delete</span>
                  <Icon class="button__icon button__icon_stroke" name="delete" />
                </button>
              </li>
            </ul>
          </template>

        </Popup>
      </div>

    </div>

    <div v-show="description.length" class="task__short-description">{{ description }}</div>

    <div v-if="extendedView" class="task__add-info">
      <div class="task__add-info-col">
        <div class="task__modified-at">
          <Icon class="task__modif-icon" name="edit-outline" />
          <span>{{ formattedModifiedAt }}</span>
        </div>
      </div>
      <div class="task__add-info-col">
        <div v-show="hidden" class="task__hidden-status">
          <Icon class="task__hidden-icon" name="eye-off" />
        </div>
        <div class="task__notes-counter">
          <Icon class="task__notes-icon" name="chat-bubble-left" />
          <span>{{ notes.length }}</span>
        </div>
      </div>
    </div>

  </li>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import dayjs from 'dayjs'

import PRIORITY_ICONS from '@/static/priorityClasses'
import { useProjectsStore } from '@/stores/projects'

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  done: {
    type: Boolean,
    default: false
  },
  name: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  notes: {
    type: Array,
    default: () => []
  },
  priority: {
    type: String,
    default: ''
  },
  hidden: {
    type: Boolean,
    default: false
  },
  tags: {
    type: Array,
    default: () => []
  },
  modifiedAt: {
    type: String,
    default: ''
  },
  extendedView: {
    type: Boolean,
    default: false
  }
})

// Data

const projectsStore = useProjectsStore()

const formattedModifiedAt = computed(() => {
  return dayjs(props.modifiedAt).format('DD MMM, YYYY h:mm A')
})
const priorityClasses = computed(() => {
  return { [`task__priority_${ props.priority }`]: !!props.priority }
})

// Handlers

const toggleTaskDone = () => projectsStore.toggleTaskDone(props.id)

// Menu

const menuRef = ref(null)
const toggleMenu = () => menuRef.value.toggle()
const closeMenu = () => menuRef.value.close()

const hideTaskBtnIcon = computed(() => {
  return props.hidden ? 'eye' : 'eye-off-filled'
})
const hideTaskBtnText = computed(() => {
  return props.hidden ? 'Show' : 'Hide'
})
const toggleTaskVisibility = () => {
  if (props.hidden) {
    projectsStore.showTask(props.id)
  } else {
    projectsStore.hideTask(props.id)
  }
}

const duplicateTask = () => projectsStore.duplicateTask(props.id)
const removeTask = () => {

}


</script>

<style lang="scss" scoped>
@import '@/assets/scss/env';

.task {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 2px 0;
  padding: 8px 12px;
  position: relative;

  list-style: none;
  border: 1px solid get-light($sectionBorderColor);
  border-radius: 8px;

  cursor: pointer;
  user-select: none;

  &:hover {
    background-color: lighten($primaryColor, 35.5%);
    border: 1px solid lighten($primaryColor, 26%);
  }
}

.task__controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.task__controls-col {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 4px;
}

.task__tags {
  display: flex;
  gap: 4px;

  transform: translate(34px);
  transition: transform .15s ease-in-out;
}

.task__tags-item {
  display: inline-block;
  padding: 2px 6px;
  font-size: 10px;

  background-color: lighten(get-light($baseTextColor), 75%);
  border-radius: 6px;
  opacity: 0.7;
}

.task__add-tag-button {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 18px;
  padding: 1px 4px;

  font-size: 10px;
  color: lighten(get-light($baseTextColor), 25%);

  background-color: lighten(get-light($baseTextColor), 75%);
  border-radius: 6px;
}

.task__add-tag-btn-icon {
  height: 14px;
  stroke: lighten(get-light($baseTextColor), 20%);
}

.task__text-content {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.task__name {
  font-size: 14px;
  font-weight: bold;
  color: get-light($baseTextColor);
  word-break: break-word;
}

.task__short-description {
  font-size: 12px;
  color: lighten(get-light($baseTextColor), 25%);
}

.task__add-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;

  font-size: 11px;
  color: lighten(get-light($baseTextColor), 25%);
}

.task__add-info-col {
  display: flex;
  align-items: center;
  gap: 8px;
}

.task__modified-at,
.task__hidden-status,
.task__notes-counter {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.task__modif-icon,
.task__hidden-icon,
.task__notes-icon {
  width: 12px;
  height: 12px;
  stroke: lighten(get-light($baseTextColor), 25%);
}

.task__done-checkbox {
  display: none;
}

.task__done-label {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 28px;
  height: 28px;

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

.task__priority {
  padding: 4px 8px 4px 26px;
  position: relative;

  font-size: 12px;
  font-weight: bold;

  transform: translate(34px);
  transition: transform .15s ease-in-out;

  &:first-letter {
    text-transform: uppercase;
  }

  .icon {
    width: 16px;
    height: 16px;
  }

  &_minor {
    color: get-light($taskPriorityBgColor, 'minor');
    stroke: get-light($taskPriorityBgColor, 'minor');
  }

  &_major {
    color: get-light($taskPriorityBgColor, 'major');
    stroke: get-light($taskPriorityBgColor, 'major');
  }

  &_critical {
    color: get-light($taskPriorityBgColor, 'critical');
    stroke: get-light($taskPriorityBgColor, 'critical');
  }
}

.task__priority-icon {
  position: absolute;
  left: 6px;
}

.task__menu {
  opacity: 0;
  pointer-events: none;
  z-index: get-layer('popup');
  transform: translate(34px);
  transition: transform .15s ease-in-out, opacity .15s ease-in-out;
}

.task:hover .task__priority,
.task:hover .task__tags,
.task:hover .task__menu {
  pointer-events: all;
  opacity: 1;
  transform: translateX(0);
}

//@include dark-theme {
//
//  .task_selected {
//    background-color: $primaryColor;
//  }
//
//  .task__hover-bg {
//    background-image: map-get($taskHoverBg, 'dark');
//  }
//
//   .task__content_half-hidden {
//      opacity: 0.6;
//    }
//
//  .task__name {
//    color: get-dark($baseTextColor);
//  }
//
//  .task__notes-pre {
//    color: get-dark($secondaryTextColor);
//  }
//
//  .task__hidden-status {
//    fill: #fff;
//    opacity: .6;
//  }
//
//  .pointer {
//    background-color: lighten($primaryColor, 3%);
//  }
//
//}

</style>
