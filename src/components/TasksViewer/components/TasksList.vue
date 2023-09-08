<template>
  <div class="tasks-list scrollable-wrapper">

    <ul class="tasks-list__content scrollable-child" ref="tasksRef">
      <TransitionGroup :name="animationName" :css="false">
        <Task
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
          :extendedView="task.settings.ui.extendedView"
        />
      </TransitionGroup>
    </ul>

  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { storeToRefs } from 'pinia'

import { asyncRepeatBlocker, delay } from '@/utils/helpers'
import Swapper from '@/utils/swapper'

import { useUserStore } from '@/stores/user'
import { useProjectsStore } from '@/stores/projects'

import Task from '@/components/TasksViewer/components/Task.vue'

// Data

const userStore = useUserStore()
const projectsStore = useProjectsStore()

const { showHiddenTasks } = storeToRefs(userStore)
const animationName = ref('flip-list')

watch(showHiddenTasks, async () => {
  animationName.value = 'none'
  await delay()
  animationName.value = 'flip-list'
})

// Swapping lists

const tasksRef = ref(null)
const tasksSwapper = new Swapper()

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

.flip-list-move {
  transition: transform .3s ease-in-out;
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
