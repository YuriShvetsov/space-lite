<template>
  <li
    class="project"
    :class="containerClasses"
  >
    <button
      class="project__button button"
      @click="onClickButton"
    >
      <div class="project__col project__col_left">
        <Icon class="project__icon" :name="icon" />
        <span class="project__name">{{ name }}</span>
      </div>
      <div class="project__col project__col_right">
        <Icon v-show="hidden" class="project__hidden-icon" name="eye-off" />
        <span class="project__count">{{ currentTasksCount }}</span>
      </div>
    </button>
  </li>
</template>

<script setup>
import { computed } from 'vue'

import { useUserStore } from '@/stores/user'
import { useProjectsStore } from '@/stores/projects'
import { DEFAULT_PROJECT_ICON } from '@/static/projectIcons'

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
    default: DEFAULT_PROJECT_ICON
  },
  opened: {
    type: Boolean,
    default: false
  },
  hidden: {
    type: Boolean,
    default: false
  },
  tasksCounter: {
    type: Object
  }
})

const userStore = useUserStore()
const projectsStore = useProjectsStore()

const containerClasses = computed(() => {
  return { 'project_active': props.opened }
})
const currentTasksCount = computed(() => {
  const { hidden = 0, visible = 0 } = props.tasksCounter
  const MAX_COUNT = 999

  const sum = userStore.showHiddenTasks ? hidden + visible : visible

  if (!sum) return '-'

  return sum > MAX_COUNT ? `+${ MAX_COUNT }` : sum
})

// Handlers

const onClickButton = () => {
  if (props.opened) return
  projectsStore.openProject(props.id)
}

</script>

<style lang="scss" scoped>
@import '@/assets/scss/env';

.project {
  width: 100%;
  margin: 2px 0;
  position: relative;
  list-style: none;
}

.project__button {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 32px;
  padding: 8px 12px;
  position: relative;

  line-height: 1.2em;
  color: get-light($baseTextColor);
}

.project__col {
  display: flex;
  align-items: center;
}

.project__col_left {
  width: 100%;
  max-width: calc(100% - 50px);
  gap: 6px;
}

.project__col_right {
  width: 44px;
  justify-content: flex-end;
  gap: 8px;
}

.project__icon {
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  stroke: get-light($baseTextColor);
}

.project__name {
  text-overflow: ellipsis;
  overflow: hidden;
}

.project__hidden-icon {
  flex-shrink: 0;
  width: 12px;
  height: 12px;

}

.project__count {
  color: get-light($secondaryTextColor);
}

.project_active .project__button {
  background-color: lighten($primaryColor, 34%);
  transition: none;
}

@include dark-theme {

  .project__button {
    color: get-dark($baseTextColor);

    &:hover {
      background-color: darken(get-dark($bgColor, 'main'), 6%);
    }
  }

  .project__icon {
    stroke: get-dark($baseTextColor);
  }

  .project_active .list-item__button {
    background-color: $primaryColor;

    &:hover { opacity: 1; }
  }

  .project__count {
    color: darken(get-dark($secondaryTextColor), 30%);
  }

}

</style>
