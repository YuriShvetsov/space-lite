<template>
  <div class="tasks-list scrollable-wrapper">

    <ul class="tasks-list__content scrollable-child" ref="tasksRef">
      <TransitionGroup name="flip-list" :css="false">
        <Task
          class="tasks-list__task"
          v-for="task of projectsStore.availableTasks"
          :key="task._id"
          :data-swap-id="task._id"
          :id="task._id"
          :done="task.done"
          :name="task.name"
          :description="task.description"
          :notes="task.notes"
          :priority="task.priority"
          :tags="task.tags"
          :hidden="task.hidden"
          :modified-at="task.modifiedAt"
        />
      </TransitionGroup>
    </ul>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

import { asyncRepeatBlocker } from '@/utils/helpers'
import Swapper from '@/utils/swapper'
import { useProjectsStore } from '@/stores/projects'
import Task from '@/components/TasksViewer/components/Task.vue'

// Tasks

const projectsStore = useProjectsStore()

// Swapping lists

const tasksRef = ref(null)
const tasksSwapper = new Swapper()
const moveTasks = (() => {
  let isMoving = false

  return async pair => {
    if (isMoving) return
    isMoving = true
    await projectsStore.moveTasks(pair)
    isMoving = false
  }
})()

onMounted(() => {
  tasksSwapper.init(tasksRef.value, 300)
  tasksSwapper.onReady(asyncRepeatBlocker(projectsStore.moveTasks))
})

onBeforeUnmount(() => {
  tasksSwapper.destroy()
})

</script>

<style lang="scss">
@import '@/assets/scss/env';

.tasks-list {
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  gap: 8px;

  height: 100%;

  position: relative;
}

.tasks-list__content {
  display: flex;
  flex-direction: column;
  gap: 8px;

  width: 100%;
  margin: 0;
  padding: 0;
}

.tasks-list__no-tasks {
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

.flip-list {
  transition: transform .3s ease;
}

@include dark-theme {

  .tasks-list__icon {
    stroke: #ffffff;
  }

  .tasks-list__no-tasks .icon {
    stroke: #fff;
  }

}
</style>
