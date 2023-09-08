<template>
  <div v-if="hasOpenedProject && hasVisibleProjects" class="tasks-viewer">

    <div class="tasks-viewer__header">
      <div class="tasks-viewer__list-name title title_size_m" :title="projectsStore.openedProject.name">
        <Icon class="tasks-view__list-icon" :name="projectsStore.openedProject.icon" />
        <span>{{ projectsStore.openedProject.name }}</span>
      </div>
      <ProjectControls />
    </div>

    <TasksList />

    <div v-show="!hasVisibleTasks" class="tasks-viewer-label">
      <span>This project has no tasks yet</span>
    </div>

  </div>
  <div v-show="!hasVisibleProjects" class="tasks-viewer-label">
    <span>You don't have any projects yet</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

import { useUserStore } from '@/stores/user'
import { useProjectsStore } from '@/stores/projects'

import ProjectControls from './components/ProjectControls.vue'
import TasksList from './components/TasksList.vue'

const userStore = useUserStore()
const projectsStore = useProjectsStore()

const hasOpenedProject = computed(() => {
  return !!projectsStore.openedProject
})
const hasVisibleProjects = computed(() => {
  return !!projectsStore.availableProjects.length
})
const hasVisibleTasks = computed(() => {
  return !!projectsStore.availableTasks.length
})

</script>

<style lang="scss">
@import '@/assets/scss/env';

.tasks-viewer {
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  height: 100%;
  position: relative;
}

.tasks-viewer__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0 12px;
}

.tasks-view__list-icon {
  width: 18px;
  height: 18px;
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  stroke: get-light($baseTextColor);
}

.tasks-viewer__list-name {
  max-width: calc(100% - 40px);
  padding-left: 26px;
  position: relative;

  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.tasks-viewer-label {
  padding: 4px 12px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  font-size: 13px;
  color: gray;

  background-color: #fff;
  border: 1px solid get-light($sectionBorderColor);
  border-radius: 8px;

  user-select: none;
}
</style>
